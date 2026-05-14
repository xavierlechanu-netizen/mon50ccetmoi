@echo off
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set PATH=%JAVA_HOME%\bin;%PATH%
set JAVA_OPTS=-Xmx512m
set GRADLE_OPTS=-Xmx512m
echo [INFO] Building AAB v52005...
gradlew clean bundleRelease
