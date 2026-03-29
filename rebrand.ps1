$files = Get-ChildItem -Path . -Recurse -Include "*.tsx","*.ts" | Where-Object { $_.FullName -notmatch "node_modules|\.next|\.git" }

foreach ($file in $files) {
  $content = Get-Content $file.FullName -Raw -Encoding UTF8
  $newContent = $content
  $newContent = $newContent -replace "Spice &amp; Simmer", "Indo-Universe"
  $newContent = $newContent -replace "Spice & Simmer", "Indo-Universe"
  $newContent = $newContent -replace "Indian-American Fusion", "Indian Flavors, Global Inspirations"
  $newContent = $newContent -replace "Indian-American fusion", "Indian flavors with global inspirations"
  if ($newContent -ne $content) {
    Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
    Write-Host "Updated: $($file.Name)"
  }
}
Write-Host "Rebrand complete!"
