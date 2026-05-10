param(
    [string]$AvdName = ""
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$AndroidStudioJbr = "C:\Program Files\Android\Android Studio\jbr"
$LocalProperties = Join-Path $ProjectRoot "local.properties"
$GradleUserHome = Join-Path $ProjectRoot ".gradle-user"
$AndroidUserHome = Join-Path $ProjectRoot ".android-home"

if (Test-Path $AndroidStudioJbr) {
    $env:JAVA_HOME = $AndroidStudioJbr
    $env:PATH = "$AndroidStudioJbr\bin;$env:PATH"
}

$env:GRADLE_USER_HOME = $GradleUserHome
$env:ANDROID_USER_HOME = $AndroidUserHome

$sdkLine = Get-Content $LocalProperties | Where-Object { $_ -like "sdk.dir=*" } | Select-Object -First 1
if (-not $sdkLine) {
    throw "SDK Android introuvable dans local.properties. Ouvre le projet une fois dans Android Studio."
}

$SdkDir = ($sdkLine -replace "^sdk.dir=", "") -replace "\\:", ":"
$SdkDir = $SdkDir -replace "\\\\", "\"
$Emulator = Join-Path $SdkDir "emulator\emulator.exe"
$Adb = Join-Path $SdkDir "platform-tools\adb.exe"

if (-not (Test-Path $Emulator)) { throw "emulator.exe introuvable dans le SDK Android : $SdkDir" }
if (-not (Test-Path $Adb)) { throw "adb.exe introuvable dans le SDK Android : $SdkDir" }

$BuildTools36 = Join-Path $SdkDir "build-tools\36.0.0"
if (-not (Test-Path $BuildTools36)) {
    Write-Warning "Android SDK Build-Tools 36.0.0 n’est pas installé. Android Studio peut l’installer via SDK Manager."
}

Push-Location $ProjectRoot
try {
    .\gradlew.bat assembleDebug

    $avds = & $Emulator -list-avds
    if (-not $avds) {
        throw "Aucun émulateur n’est créé. Dans Android Studio : Device Manager > Create device, puis relance ce script."
    }
    if (-not $AvdName) { $AvdName = $avds[0] }

    $devices = & $Adb devices
    $hasDevice = $devices | Where-Object { $_ -match "\tdevice$" }
    if (-not $hasDevice) {
        Start-Process -FilePath $Emulator -ArgumentList @("-avd", $AvdName)
        Write-Host "Démarrage de l’émulateur $AvdName..."
        & $Adb wait-for-device
        for ($i = 0; $i -lt 60; $i++) {
            $booted = (& $Adb shell getprop sys.boot_completed 2>$null).Trim()
            if ($booted -eq "1") { break }
            Start-Sleep -Seconds 2
        }
    }

    $Apk = Join-Path $ProjectRoot "app\build\outputs\apk\debug\app-debug.apk"
    & $Adb uninstall "fr.concoursdgfip.prep" 2>$null | Out-Null
    & $Adb install -r $Apk
    & $Adb shell am start -n "fr.concoursdgfip.prep/.MainActivity"
    Write-Host "Application lancée sur l’émulateur."
}
finally {
    Pop-Location
}
