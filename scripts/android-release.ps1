param([switch]$CreateKey)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$vault = Join-Path ([Environment]::GetFolderPath('LocalApplicationData')) 'SmartSoma\assinatura'
$store = Join-Path $vault 'smartsoma-upload.jks'
$passwordFile = Join-Path $vault 'upload-password.dpapi'
$javaHome = 'C:\Program Files\Android\Android Studio\jbr'
$sdk = Join-Path ([Environment]::GetFolderPath('LocalApplicationData')) 'Android\Sdk'
$keytool = Join-Path $javaHome 'bin\keytool.exe'
$jarsigner = Join-Path $javaHome 'bin\jarsigner.exe'
if (!(Test-Path -LiteralPath $keytool) -or !(Test-Path -LiteralPath $sdk)) { throw 'Android Studio ou SDK não encontrado.' }

if ($CreateKey) {
    if ((Test-Path -LiteralPath $store) -or (Test-Path -LiteralPath $passwordFile)) {
        throw 'Já existe uma chave ou senha neste local; nada foi substituído.'
    }
    if (!(Test-Path -LiteralPath $vault)) { New-Item -ItemType Directory -Path $vault | Out-Null }
    # Restrict the directory before creating sensitive files. Windows DPAPI
    # additionally binds the encrypted password to this Windows account.
    $identity = [System.Security.Principal.WindowsIdentity]::GetCurrent().User
    $system = [System.Security.Principal.SecurityIdentifier]::new('S-1-5-18')
    $acl = [System.Security.AccessControl.DirectorySecurity]::new()
    $acl.SetOwner($identity)
    $acl.SetAccessRuleProtection($true, $false)
    foreach ($sid in @($identity, $system)) {
        $rule = [System.Security.AccessControl.FileSystemAccessRule]::new($sid, 'FullControl', 'ContainerInherit,ObjectInherit', 'None', 'Allow')
        $acl.AddAccessRule($rule)
    }
    Set-Acl -LiteralPath $vault -AclObject $acl
    $bytes = [byte[]]::new(32)
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
    $secret = [Convert]::ToHexString($bytes)
    $encrypted = ConvertTo-SecureString $secret -AsPlainText -Force | ConvertFrom-SecureString
    [IO.File]::WriteAllText($passwordFile, $encrypted)
    try {
        $env:SMARTSOMA_UPLOAD_STORE_PASSWORD = $secret
        $env:SMARTSOMA_UPLOAD_KEY_PASSWORD = $secret
        & $keytool -genkeypair -keystore $store -storetype PKCS12 -alias smartsoma-upload -keyalg RSA -keysize 3072 -validity 10000 -dname 'CN=SmartSoma' -storepass:env SMARTSOMA_UPLOAD_STORE_PASSWORD -keypass:env SMARTSOMA_UPLOAD_KEY_PASSWORD
        if ($LASTEXITCODE -ne 0) { throw 'Não foi possível criar a chave; verificar o cofre antes de tentar novamente.' }
    } finally {
        Remove-Item Env:SMARTSOMA_UPLOAD_STORE_PASSWORD, Env:SMARTSOMA_UPLOAD_KEY_PASSWORD -ErrorAction SilentlyContinue
        $secret = $null
    }
}

if (!(Test-Path -LiteralPath $store) -or !(Test-Path -LiteralPath $passwordFile)) {
    throw 'A chave de upload e a senha protegida precisam de existir.'
}
$secure = Get-Content -LiteralPath $passwordFile -Raw | ConvertTo-SecureString
$secret = [System.Net.NetworkCredential]::new('', $secure).Password
try {
    $env:JAVA_HOME = $javaHome
    $env:ANDROID_HOME = $sdk
    $env:SMARTSOMA_UPLOAD_STORE_FILE = $store
    $env:SMARTSOMA_UPLOAD_STORE_PASSWORD = $secret
    $env:SMARTSOMA_UPLOAD_KEY_ALIAS = 'smartsoma-upload'
    $env:SMARTSOMA_UPLOAD_KEY_PASSWORD = $secret
    Push-Location $root
    try {
        & npm run capacitor:sync
        if ($LASTEXITCODE -ne 0) { throw 'Falha ao preparar os recursos Android.' }
        Push-Location (Join-Path $root 'android')
        try {
            & .\gradlew.bat bundleRelease
            if ($LASTEXITCODE -ne 0) { throw 'Falha ao gerar o AAB.' }
        } finally { Pop-Location }
        $bundle = Join-Path $root 'android\app\build\outputs\bundle\release\app-release.aab'
        & $jarsigner -verify $bundle
        if ($LASTEXITCODE -ne 0) { throw 'Falha ao verificar a assinatura do AAB.' }
        Write-Output "AAB verificado: $bundle"
        Write-Output "Chave de upload: $store"
        Write-Output 'IMPORTANTE: a senha DPAPI só abre neste utilizador Windows. Guarda a chave e uma cópia recuperável da senha num gestor seguro.'
    } finally { Pop-Location }
} finally {
    Remove-Item Env:SMARTSOMA_UPLOAD_STORE_FILE, Env:SMARTSOMA_UPLOAD_STORE_PASSWORD, Env:SMARTSOMA_UPLOAD_KEY_ALIAS, Env:SMARTSOMA_UPLOAD_KEY_PASSWORD -ErrorAction SilentlyContinue
    $secret = $null
}
