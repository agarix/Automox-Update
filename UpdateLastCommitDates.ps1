$logFile = "$PSScriptRoot\madcap-prebuild-log.txt"
Start-Transcript -Path $logFile -Append

Write-Host "===== Script Started ====="
Write-Host "Start Time: $(Get-Date)"
Write-Host ""

$projectRoot = $PSScriptRoot
$folder = Join-Path $projectRoot "Content\Product Documentation"

Write-Host "Scanning folder: $folder`n"

$files = Get-ChildItem -Path $folder -Include *.htm, *.html -Recurse -File

foreach ($file in $files) {
    $filePath = $file.FullName
    Write-Host "`n--- Checking: $filePath ---"

    # Compute relative path manually from project root
    $relativePath = $filePath.Substring($projectRoot.Length + 1).Replace("\", "/")
    Write-Host "Relative path: $relativePath"

    # Check if file is tracked in Git
    git ls-files --error-unmatch "$relativePath" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Skipping untracked file: $filePath"
        continue
    }

    # Get Git last commit date with time
    $gitDate = git log -1 --format="%ad" --date=format:"%d %B, %Y %I:%M %p" -- "$relativePath" 2>$null
    if (-not $gitDate) {
        Write-Host "No Git date found."
        continue
    }

    Write-Host "Git Date Found: $gitDate"

    $content = Get-Content -Path $filePath -Raw
    $originalContent = $content

    # Define the badge comment
    $badgeComment = "<!-- last-updated-badge: $gitDate -->"
    $badgePattern = "<!-- last-updated-badge: .*? -->"

    if ($content -match $badgePattern) {
        Write-Host "Updating existing badge comment..."
        $content = [regex]::Replace($content, $badgePattern, $badgeComment)
    } elseif ($content -match "</body>") {
        Write-Host "Inserting new badge comment before </body>..."
        $content = $content -replace "</body>", "$badgeComment`n</body>"
    } else {
        Write-Host "No </body> tag found. Skipping injection."
    }

    # Save only if content has changed
    if ($content -ne $originalContent) {
        Set-Content -Path $filePath -Value $content -Encoding UTF8
        Write-Host "Updated: $filePath"
    } else {
        Write-Host "No update needed."
    }
}

Write-Host "`n===== Script Completed ====="
Write-Host "End Time: $(Get-Date)"

Stop-Transcript
