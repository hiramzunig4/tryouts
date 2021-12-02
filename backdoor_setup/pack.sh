#!/bin/bash -xe

(cd ../lv-react-ui; yarn run build)
rm -fr build
mkdir -p build
touch build/.empty
cp -fr ../lv-react-ui/build .
