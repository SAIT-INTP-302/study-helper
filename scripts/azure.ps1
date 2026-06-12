<#
.SYNOPSIS
    Windows wrapper — delegates to scripts/azure.sh via WSL or Git Bash.
.DESCRIPTION
    Usage: .\scripts\azure.ps1 {up [--hosting]|down [--wait]|info|deploy}
#>

$ErrorActionPreference = 'Stop'

# Run from the project root so azure.sh's relative paths (.env.local, etc.) resolve correctly.
Push-Location (Split-Path $PSScriptRoot -Parent)
try {
    if (Get-Command wsl -ErrorAction SilentlyContinue) {
        wsl bash ./scripts/azure.sh @args
    } elseif (Get-Command bash -ErrorAction SilentlyContinue) {
        # Covers Git Bash / MSYS2 / Cygwin when bash is already on PATH.
        bash ./scripts/azure.sh @args
    } elseif (Test-Path 'C:\Program Files\Git\bin\bash.exe') {
        & 'C:\Program Files\Git\bin\bash.exe' ./scripts/azure.sh @args
    } else {
        Write-Error @"
No bash runtime found. Install one of:
  WSL (recommended):  winget install Microsoft.WSL
  Git for Windows:    winget install Git.Git
"@
        exit 1
    }
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
