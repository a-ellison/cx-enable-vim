if ! [[ -d dist/firefox ]]; then
    bash scripts/make_firefox.sh
fi
web-ext run -s dist/firefox/src -t firefox-desktop -p development --verbose
