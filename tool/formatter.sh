#!/bin/sh

# only test on Mac

cd $( dirname $0 )
files="../popup.js ../manifest.json ../form_discover.js ../popup.html"
for file in $files
do
    tempfile=.$( basename $file )
    expand -t 4 $file > $tempfile && mv $tempfile $file
done

