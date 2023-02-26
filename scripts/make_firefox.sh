mkdir -p dist/firefox/src
mkdir -p dist/firefox/web-ext-artifacts
cp -r src/js dist/firefox/src
# the "browser.action" will only be available in manifest v3
sed -i "s/browser.action/browser.browserAction/g" dist/firefox/src/js/toggle.js
cp -r src/icons dist/firefox/src
cp src/manifest/firefox.json dist/firefox/src/manifest.json
web-ext build -s dist/firefox/src -a dist/firefox/web-ext-artifacts -o
