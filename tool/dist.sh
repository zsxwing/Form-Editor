#!/bin/sh

cd $( dirname $0 )
cd ..
files="form_discover.js icon128.png icon16.png icon19.png icon48.png jquery.js manifest.json popup.html"
rm -f dist/*
zip dist/FormEditor.zip $files

