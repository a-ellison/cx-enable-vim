mkdir -p dist/firefox/src
mkdir -p dist/firefox/web-ext-artifacts
cp -r src/js dist/firefox/src/js
cp -r src/icons dist/firefox/src/icons
cp src/manifest/firefox.json dist/firefox/src/manifest.json
web-ext build -s dist/firefox/src -a dist/firefox/web-ext-artifacts -o
