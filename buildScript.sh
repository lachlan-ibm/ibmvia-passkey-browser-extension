#!/bin/bash
# Turn on debug
set -x
# instructs bash to immediately exit if any command [1] has a non-zero 
# exit status
set -e

INSTALL_NODE_VER=22.4.1
INSTALL_NPM_VER=10.8.1


if command -v node $> /dev/null; then
    echo "node.js installation found"
    printf "node version:%1s"
    node -v
else
    echo "node.js installation not found. Please install node.js version $INSTALL_NODE_VER"
    exit 1
fi

if command -v npm $> /dev/null; then
    echo "npm installation found"
    printf "npm version:%1s"
    npm -v
else
    echo "node.js installation not found. Please install node.js version $INSTALL_NPM_VER"
    exit 1
fi

# This script automates the build process for the fido2 browser extension
echo "Hello, time to automate the build process!"
# Store exit status in variable
status=$?
# Shane's fido2 client git repository url
REPO_URL="https://github.com/sbweeden/fido2-node-clients.git"
REPO_DIR="./fido2-node-clients"
# Clone the Git repository
echo "Cloning repository..."
git clone $REPO_URL
cd $REPO_DIR

# Install the node modules
npm install

# Find the fidoutilsConfig variable and replace with hardcoded object
HARDCODED_OBJECT='"The replace method worked with sed";'

sed -i '' "s/fidoutilsConfig =.*/fidoutilsConfig =$HARDCODED_OBJECT/" fidoutils.js

# Check if user has browerify, if not install the package
if command -v browserify $> /dev/null; then
    echo "browserify installation found"
    printf "browserify version:%1s"
    browserify --version
else
    echo "browserify installation not found. Installing neccessary package now."
    npm install -g browserify
    exit 1
fi
# Bundle Shane's fido2 node client
browserify -s fido fidoutils.js -o bundle.js

# Copy the contents of bundle.js into content.js above the original code
echo "$(cat bundle.js ../content.js)" > ../content.js
