@echo off
setlocal
set "APP_HOME=%~dp0"
set "WRAPPER_DIR=%APP_HOME%gradle\wrapper"
set "WRAPPER_JAR=%WRAPPER_DIR%\gradle-wrapper.jar"
set "WRAPPER_URL=https://raw.githubusercontent.com/gradle/gradle/v8.9.0/gradle/wrapper/gradle-wrapper.jar"
set "EXPECTED_SHA256=498495120a03b9a6ab5d155f5de3c8f0d986a449153702fb80fc80e134484f17"

if not exist "%WRAPPER_DIR%" mkdir "%WRAPPER_DIR%"
if not exist "%WRAPPER_JAR%" (
  echo Descargando Gradle Wrapper 8.9...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -UseBasicParsing -Uri '%WRAPPER_URL%' -OutFile '%WRAPPER_JAR%'"
  if errorlevel 1 exit /b 1
)

for /f %%H in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "(Get-FileHash -Algorithm SHA256 -LiteralPath '%WRAPPER_JAR%').Hash.ToLower()"') do set "ACTUAL_SHA256=%%H"
if /I not "%ACTUAL_SHA256%"=="%EXPECTED_SHA256%" (
  del "%WRAPPER_JAR%" >nul 2>&1
  echo ERROR: checksum de Gradle Wrapper invalido.
  exit /b 1
)

java -classpath "%WRAPPER_JAR%" org.gradle.wrapper.GradleWrapperMain %*
exit /b %ERRORLEVEL%
