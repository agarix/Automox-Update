param (
    [string]$SitemapFilePath
)

$ExcludePatterns = @(
    '/Archive/', '/legacy-docs/', 'old-content.htm',
    '.css', '.js', '.png', '.jpg', '.gif', '.svg',
    '/Resources/', '/Assets/', '/Images/',
    '/Stylesheets/', '/Scripts/', '/js/', '/Branding/',
    '/Fonts/', '/TableStyles/', '/Snippets/', '/TemplatePages/',
    '/MasterPages/', '/Videos/', '/PageLayouts/'
)

Write-Host "--- Sitemap Filtering Script Started ---"
Write-Host "Processing: $SitemapFilePath"

if (-not (Test-Path $SitemapFilePath)) {
    Write-Error "Sitemap not found: $SitemapFilePath"
    exit 1
}

try {
    $xmlDoc = New-Object System.Xml.XmlDocument
    $xmlDoc.Load($SitemapFilePath)

    $nsMgr = New-Object System.Xml.XmlNamespaceManager($xmlDoc.NameTable)
    $nsMgr.AddNamespace("sm", "http://www.sitemaps.org/schemas/sitemap/0.9")

    $nav = $xmlDoc.CreateNavigator()
    $iter = $nav.Select("//sm:url", $nsMgr)

    $nodesToRemove = @()

    while ($iter.MoveNext()) {
        $urlNode = $iter.Current
        $locNode = $urlNode.SelectSingleNode("sm:loc", $nsMgr)

        if ($locNode -ne $null) {
            $url = $locNode.Value
            foreach ($pattern in $ExcludePatterns) {
                if ($url -like "*$pattern*") {
                    $nodesToRemove += $urlNode.UnderlyingObject
                    Write-Host "Removing: $url"
                    break
                }
            }
        }
    }

    foreach ($node in $nodesToRemove) {
        $node.ParentNode.RemoveChild($node) | Out-Null
    }

    $xmlDoc.Save($SitemapFilePath)
    Write-Host "Cleaned $($nodesToRemove.Count) URLs."
}
catch {
    Write-Error "Error: $($_.Exception.Message)"
    exit 1
}

Write-Host "--- Sitemap Filtering Script Finished ---"
