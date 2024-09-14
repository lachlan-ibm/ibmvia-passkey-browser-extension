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
echo "Installing node modules for browser extension!"
# Install required packages such as uuid
npm install
# Store exit status in variable
status=$?

# Make build directory which will be used as the extensions entry point when loading unpacked
mkdir build

# Copy the relevent files into build directory
cp side_panel.html ./build
cp side_panel.css ./build
cp side_panel.css ./build
cp middle.js ./build
cp -r icons/ ./build/icons

# Shane's fido2 client git repository url
REPO_URL="https://github.com/sbweeden/fido2-node-clients.git"
REPO_DIR="./fido2-node-clients"
# Clone the Git repository
echo "Cloning repository..."
git clone $REPO_URL
cd $REPO_DIR

# Install the node modules
npm install


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


# Concant the contents of bundle.js and content.js into new file main.js
cat bundle.js ../content.js >> ../build/main.js

# Find the fidoutilsConfig variable and replace with hardcoded object
# FIDO_UTILS_CONFIG='let fidoutilsConfig = null;'

# sed -i -e '/let fidoutilsConfig =.*/,+5d' main.js

# sed -i -e '' "/let fidoutilsConfig =.*/,+5d =$FIDO_UTILS_CONFIG/" ../main.js

# sed -i -e '/let fidoutilsConfig =.*/,+4d' ../main.js
sed -i "" -e '/let fidoutilsConfig =.*/{n;N;N;N;d;}' ../build/main.js
# sed -i '' "6145,6148d" ../main.js

# Create a copy in the certs directory of the copied version of generate_attestation_certs.js
cp ../copy_generate_attestation_certs.js certs/

# mv ../copy_generate_attestation_certs.js certs/

# Bundle Shane's node implementation to generate attestation artefacts
cd certs

# comment out the lines that require the node js crypto package which causes an error when using browserify
# sed -i '' "13 s/^/\/\//" generate_attestation_certs.js
# sed -i '' "282 s/^/\/\//" generate_attestation_certs.js
# sed -i '' "291 s/^/\/\//" generate_attestation_certs.js

# bundle the generate_attestation_certs.js file
browserify -s fido copy_generate_attestation_certs.js -o bundle.js
cd ..
cd ..

# Concant the contents of bundle.js and background.js into new file background_script.js
cat $REPO_DIR/certs/bundle.js background.js >> ./build/background_script.js
# cat $REPO_DIR/certs/bundle.js middleScript.js >> ./build/middle.js
chmod -R +w $REPO_DIR
rm -r $REPO_DIR

# if [["$1" == "chrome"]]; then
#     echo "Hello"
# else
#     echo "Please specify the browser you intend to build for"
# fi
# output_file = "manifest.json"
# long_options=("short-option:" "long-option:")
# browser = ""
while getopts "b:" opt; do
    case ${opt} in
        b) 
            echo "Option -b was triggered, Argument: ${OPTARG}"
            if [[ "$OPTARG" == "chrome" ]]; then
                echo "Creating chrome manifest.json configuration"
                cat manifest.chrome.json >> ./build/manifest.json
                cd build
                web-ext -a ../dist build
                # chrome.exe --pack-extension
                # chrome --pack-extension="ibm-security-passkey"

            elif [[ "$OPTARG" == "firefox" ]]; then
                echo "Creating firefox manifest.json configuration"
                cat manifest.firefox.json >> ./build/manifest.json
                cd build
                web-ext -a ../dist build
            else 
                echo "Defaulting to chrome manifest.json configuration"
                cat manifest.chrome.json >> ./build/manifest.json
            fi
            ;;

        :)
            echo "Option -${OPTARG} requires an argument."
            ;;
        ?)
            echo "No option: -${OPTARG}"
            exit 1
            ;;
    esac
done
