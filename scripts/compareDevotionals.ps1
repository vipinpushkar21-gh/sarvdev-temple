$ErrorActionPreference='Stop'

$live = Invoke-RestMethod 'https://sarvdev-temple-live.vercel.app/api/devotionals'
Write-Output '---LIVE---'
Write-Output ('COUNT: ' + ($live | Measure-Object).Count)
$live | Select-Object -First 5 | ForEach-Object { Write-Output ('TITLE: ' + ($_.title -ne $null ? $_.title : '‹no title›')) }

$local = Invoke-RestMethod 'http://localhost:3000/api/devotionals'
Write-Output '---LOCAL---'
Write-Output ('COUNT: ' + ($local | Measure-Object).Count)
$local | Select-Object -First 5 | ForEach-Object { Write-Output ('TITLE: ' + ($_.title -ne $null ? $_.title : '‹no title›')) }
