Write-Host "===== Script Started ====="

$projectRoot = $PSScriptRoot
$folder = Join-Path $projectRoot "Content\Product Documentation"

Write-Host "`nScanning folder: $folder`n"

$files = Get-ChildItem -Path $folder -Include *.htm, *.html -Recurse -File

foreach ($file in $files) {
    $filePath = $file.FullName
    Write-Host "Checking: $filePath"

    # Get Git commit date
    $gitDate = git log -1 --format="%ad" --date=format:"%d %B, %Y" -- "$filePath" 2>$null
    $hasGitDate = $true

    if (-not $gitDate) {
        $gitDate = ""  # No date found
        $hasGitDate = $false
        Write-Host "No Git date found."
    } else {
        Write-Host "Git Date Found: $gitDate"
    }

    $content = Get-Content -Path $filePath -Raw
    $originalContent = $content

    # Inject badge block after <h1> if not present already
    if ($content -match '<body[^>]*(class="[^"]*other-topics[^"]*"|body="other-topics")[^>]*>') {
        if ($content -match '<div role="main" id="mc-main-content">.*?<h1[^>]*>.*?</h1>' -and $content -notmatch '<span class="last-commit-date">') {
            Write-Host "Injecting badge after <h1>"

            $injection = '<p class="badge-wrapper"' + 
                         ($hasGitDate ? '' : ' style="display:none;"') + 
                         '><label class="badgeNew">New</label> ' + 
                         '<span class="last-commit-date">' + $gitDate + '</span></p>'

            $content = [regex]::Replace(
                $content,
                '(<div role="main" id="mc-main-content">.*?<h1[^>]*>.*?</h1>)',
                '$1' + $injection,
                'Singleline'
            )
        }
    }

    # Update existing date span and control wrapper visibility
    $content = [regex]::Replace(
        $content,
        '<p class="badge-wrapper"( style="display:none;")?>\s*<label class="badgeNew">New</label>\s*<span class="last-commit-date">.*?</span>\s*</p>',
        '<p class="badge-wrapper"' + 
        ($hasGitDate ? '' : ' style="display:none;"') + 
        '><label class="badgeNew">New</label> <span class="last-commit-date">' + $gitDate + '</span></p>'
    )

    # Save file if modified
    if ($content -ne $originalContent) {
        Set-Content -Path $filePath -Value $content -Encoding UTF8
        Write-Host "✅ Updated: $filePath"
    } else {
        Write-Host "No update needed."
    }
}

Write-Host "===== Script Completed ====="
