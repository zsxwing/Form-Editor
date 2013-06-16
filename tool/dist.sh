#!/bin/sh

# only test on Mac

js_files="form_discover.js popup.js history.js options.js"

optim_js() {
    for js_file in $js_files
    do
        if which java
        then
            java -jar compiler.jar ../$js_file --js_output_file ../dist/$js_file
        else
            cp ../$js_file ../dist/
        fi
    done
}

# optim
cd $( dirname $0 )
rm -f ../dist/*
optim_js

# copy other resources
cd ..
files="icon128.png icon16.png icon19.png icon48.png jquery.js manifest.json popup.html options.html"
cp $files dist/

# package
cd dist
zip FormEditor.zip $files $js_files 
rm -f $files $js_files 

