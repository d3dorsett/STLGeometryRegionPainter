$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$files = @(
  @('https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js', 'vendor/three/three.module.js'),
  @('https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/controls/OrbitControls.js', 'vendor/three/addons/controls/OrbitControls.js'),
  @('https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/loaders/STLLoader.js', 'vendor/three/addons/loaders/STLLoader.js'),
  @('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm', 'vendor/jszip/jszip.esm.js')
)
foreach ($file in $files) {
  $target = Join-Path $root $file[1]
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $target) | Out-Null
  Write-Host "Downloading $($file[1]) ..."
  Invoke-WebRequest -Uri $file[0] -OutFile $target -ErrorAction Stop
  if ((Get-Item $target).Length -lt 100) { throw "Download appears incomplete: $target" }
}
Write-Host 'Downloaded all four dependency files. Upload index.html and vendor/ to web-development.'
