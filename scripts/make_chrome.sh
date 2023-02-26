mkdir -p dist/chrome/src
mkdir -p dist/chrome/web-ext-artifacts
cp -r src/js dist/chrome/src
cp -r src/icons dist/chrome/src
cp src/manifest/chrome.json dist/chrome/src/manifest.json
web-ext build -s dist/chrome/src -a dist/chrome/web-ext-artifacts -o
