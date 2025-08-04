Write-Host "===== Script Started ====="

$projectRoot = $PSScriptRoot
$folder = Join-Path $projectRoot "Content\Product Documentation"

Write-Host " Scanning folder: $folder`n"

$files = Get-ChildItem -Path $folder -Include *.htm, *.html -Recurse -File

foreach ($file in $files) {
    $filePath = $file.FullName
    Write-Host "Checking: $filePath"

    # Use relative path for Git commands
    $relativePath = Resolve-Path -Relative -Path $filePath
    Write-Host "Relative path: $relativePath"

    # Check if file is tracked in Git
    $isTracked = git ls-files --error-unmatch "$relativePath" 2>$null

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Skipping untracked file: $filePath"
        continue
    }

    # Get Git last commit date
    $gitDate = git log -1 --format="%ad" --date=format:"%d %B, %Y" -- "$relativePath" 2>$null
    $hasGitDate = $gitDate -ne ""

    if ($hasGitDate) {
        Write-Host "Git Date Found: $gitDate"
        $style = ""
    } else {
        Write-Host "No Git date found."
        $style = ' style="display:none;"'
    }

    # Read file content
    $content = Get-Content -Path $filePath -Raw
    $originalContent = $content

    # Debug content structure
    $hasOtherTopics = $content -match '<body[^>]*(class="[^"]*other-topics[^"]*"|body="other-topics")[^>]*>'
    $hasMainH1 = $content -match '<div role="main" id="mc-main-content">.*?<h1[^>]*>.*?</h1>'
    $hasBadge = $content -match '<span class="last-commit-date">'

    Write-Host "hasOtherTopics: $hasOtherTopics, hasMainH1: $hasMainH1, hasBadge: $hasBadge"

    # Inject badge after <h1> if not already injected
    if ($hasOtherTopics) {
        if ($hasMainH1 -and -not $hasBadge) {
            Write-Host "Injecting badge after <h1>..."

            $injection = '<p class="badge-wrapper"' + $style +
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

    # Update existing badge if present
    Write-Host "Updating existing badge (if found)..."
    $updatedBadge = '<p class="badge-wrapper"' + $style +
                    '><label class="badgeNew">New</label> <span class="last-commit-date">' + $gitDate + '</span></p>'

    $content = [regex]::Replace(
        $content,
        '<p class="badge-wrapper"( style="display:none;")?>\s*<label class="badgeNew">New</label>\s*<span class="last-commit-date">.*?</span>\s*</p>',
        $updatedBadge
    )

    # Save only if content has changed
    if ($content -ne $originalContent) {
        Set-Content -Path $filePath -Value $content -Encoding UTF8
        Write-Host "Updated: $filePath"
    } else {
        Write-Host "No update needed."
    }
}

Write-Host "`n===== Script Completed ====="
