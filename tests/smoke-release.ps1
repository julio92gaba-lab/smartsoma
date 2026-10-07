param(
  [Parameter(Mandatory=$true)][string]$Deployment,
  [switch]$Protected
)
$ErrorActionPreference = 'Stop'
$releaseUri = [Uri]$Deployment
if ($releaseUri.Scheme -ne 'https' -or $releaseUri.AbsolutePath -ne '/') { throw 'Expected an HTTPS origin.' }
function Read-Release([string]$Route) {
  if ($Protected) {
    $lines = & vercel.cmd curl $Route --deployment $Deployment --scope team_6op6ddx7P3EyXYgyjX2amOv6 -- --silent --show-error --write-out '\n%{http_code}'
  } else {
    $lines = & curl.exe --silent --show-error --location ($Deployment.TrimEnd('/') + $Route) --write-out '\n%{http_code}'
  }
  if ($LASTEXITCODE -ne 0) { throw "Request failed: $Route" }
  $raw = ($lines -join "`n")
  $split = $raw.LastIndexOf("`n")
  return @{ Body=$raw.Substring(0,$split); Status=[int]$raw.Substring($split+1) }
}
$files = @{'/app'='app.html'; '/login'='login.html'; '/app.js'='app.js'; '/ui-v2.js'='ui-v2.js'; '/ui-v2.css'='ui-v2.css'; '/cloud-init.js'='cloud-init.js'; '/sw.js'='sw.js'}
foreach ($route in $files.Keys) {
  $response = Read-Release $route
  if ($response.Status -ne 200) { throw "Unexpected HTTP $($response.Status): $route" }
  $local = [IO.File]::ReadAllText((Join-Path $PSScriptRoot ('../'+$files[$route]))).Replace("`r`n","`n").TrimEnd()
  if ($response.Body.Replace("`r`n","`n").TrimEnd() -cne $local) { throw "Published source mismatch: $route" }
  Write-Output "PASS 200 exact source $route"
}
foreach ($route in @('/','/legal','/logo-home.png','/jspdf.umd.min.js')) {
  $response=Read-Release $route
  if ($response.Status -ne 200) { throw "Unexpected HTTP $($response.Status): $route" }
  Write-Output "PASS 200 $route"
}
foreach ($route in @('/tests/visual-fixture.js','/mockup/','/smartsoma-backup-2026-10-03-prelaunch.zip')) {
  $response=Read-Release $route
  if ($response.Status -ne 404) { throw "Private artifact exposed: $route ($($response.Status))" }
  Write-Output "PASS 404 excluded $route"
}
foreach ($route in @('/api/delete-account','/api/webhook')) {
  $response=Read-Release $route
  if ($response.Status -ne 405) { throw "Expected rejected GET, got $($response.Status): $route" }
  Write-Output "PASS 405 non-mutating API check $route"
}
