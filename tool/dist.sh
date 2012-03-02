#!/bin/sh

# only test on Mac

optim_js() {
    if which java
    then
        java -jar compiler.jar ../popup.js --js_output_file ../dist/popup.js
        java -jar compiler.jar ../form_discover.js --js_output_file ../dist/form_discover.js
    else
        cp ../popup.js ../form_discover.js ../dist/
    fi
}

# optim
cd $( dirname $0 )
rm -f ../dist/*
optim_js

# copy other resources
cd ..
files="icon128.png icon16.png icon19.png icon48.png jquery.js manifest.json popup.html"
cp $files dist/

# package
cd dist
zip FormEditor.zip $files form_discover.js popup.js
rm -f $files form_discover.js popup.js

