@echo off
setlocal enabledelayedexpansion

set "__SRV_debugMode=0"
set "__SRV_portNumber=80"

set "__SRV_localHasSeenWiFi=0"

for /f "usebackq delims=" %%L in (`ipconfig`) do (
    set "line=%%L"
   
    call :debugPrint "Current Line: !line!"
   
    if /I "!line!"=="Wireless LAN adapter Wi-Fi:" (
        set "__SRV_localHasSeenWiFi=1"
	call :debugPrint "Found the correct line: "
        call :debugPrint  !__SRV_localHasSeenWiFi!
    )
    
    if /I "!__SRV_localHasSeenWiFi!"=="1" (
        call :debugPrint "Inside if /I "!__SRV_localHasSeenWiFi!" equ 1"
        REM Check if line matches a pattern (wildcard / regex)
        echo !line! | findstr /r "IPv4" >nul
        if !errorlevel! equ 0 (
            REM Extract part of the line – example using delimiters
            for /f "tokens=2 delims=:" %%A in ("!line!") do (
                set "__SRV_localIP=%%A"
                
                REM Trim spaces and use it
                set "__SRV_IPv4Address=!__SRV_localIP: =!"
                call :debugPrint "We found our local IPv4 Address: !__SRV_IPv4Address!"
                goto :startServer
            )
        )
    )
)

:startServer
cd %~dp0
hugo server -D --bind "0.0.0.0" --baseURL "http://!__SRV_IPv4Address!:!__SRV_portNumber!" --port !__SRV_portNumber! --noHTTPCache

goto :halt

:debugPrint
    if !__SRV_debugMode! EQU 0 (
        exit /B 0
    )
    
    set "__SRV_localArg0=%1"
    echo [DEBUG]: !__SRV_localArg0:^"=!
    exit /B 0
    
:halt
    exit /B 0