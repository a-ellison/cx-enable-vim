if ! [[ -d dist/chrome ]]; then
    bash scripts/make_chrome.sh
fi
web-ext run -s dist/chrome/src -t chromium --verbose --devtools
