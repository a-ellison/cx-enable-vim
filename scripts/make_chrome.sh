mkdir -p dist/src/firefox
mkdir -p dist/web-ext/firefox
cp -r src/js dist/firefox/js
cp -r src/icons dist/firefox/icons
cp src/manifest/firefox.json dist/firefox/manifest.json
web-ext build -s dist/src/firefox -a dist/web-ext/firefox -o
