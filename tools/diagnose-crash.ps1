$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$LocalProperties = Join-Path $ProjectRoot "local.properties"
$Report = Join-Path $ProjectRoot "android-crash-report.txt"

$sdkLine = Get-Content $LocalProperties | Where-Object { $_ -like "sdk.dir=*" } | Select-Object -First 1
if (-not $sdkLine) {
    throw "SDK Android introuvable dans local.properties. Ouvre le projet une fois dans Android Studio."
}

$SdkDir = ($sdkLine -replace "^sdk.dir=", "") -replace "\\:", ":"
$SdkDir = $SdkDir -replace "\\\\", "\"
$Adb = Join-Path $SdkDir "platform-tools\adb.exe"
if (-not (Test-Path $Adb)) { throw "adb.exe introuvable dans le SDK Android : $SdkDir" }

& $Adb logcat -c
& $Adb shell am force-stop "fr.concoursdgfip.prep" 2>$null | Out-Null
& $Adb shell am start -n "fr.concoursdgfip.prep/.MainActivity" | Out-Null
Start-Sleep -Seconds 3

& $Adb logcat -d -v time AndroidRuntime:E ActivityTaskManager:E fr.concoursdgfip.prep:E '*:S' | Set-Content -Path $Report -Encoding UTF8
Write-Host "Rapport créé : $Report"
