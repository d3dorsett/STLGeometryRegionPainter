STL Geometry Region Painter — Step 5 preparation

This ZIP is NOT YET OFFLINE READY. Network restrictions prevented downloading the four third-party libraries in advance.

On Windows: extract ZIP; right-click PowerShell in extracted folder or open PowerShell there, then run:
  powershell -ExecutionPolicy Bypass -File .\download-dependencies.ps1

The script downloads four pinned dependency files. Inspect the script before running.

Then upload index.html and the entire vendor folder to the web-development branch, preserving folder paths. Do not upload download-dependencies.ps1 or README.txt. Do not change main.

The import map uses local relative paths; the JavaScript app logic is unchanged. Test the same five application functions. Offline support still requires a service worker (later step).
