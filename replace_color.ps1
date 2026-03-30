$files = Get-ChildItem -Path 'd:\Project\SOVEREIGN-CHAT\src' -Recurse -Include '*.jsx','*.css','*.js','*.ts','*.tsx'
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match 'FF8411') {
        $content = $content -replace 'FF8411', 'FFC107'
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host 'Updated:' $file.FullName
    }
}
