#!/bin/bash
# Turn on debug
set -x
# Instructs bash to immediately exit if any command has a non-zero exit status
set -e

INSTALL_NODE_VER=22.4.1
INSTALL_NPM_VER=10.8.1

# Check for Node.js installation
if command -v node > /dev/null; then
    echo "node.js installation found"
    printf "node version: %s\n" "$(node -v)"
else
    echo "node.js installation not found. Please install node.js version $INSTALL_NODE_VER"
    exit 1
fi

# Check for npm installation
if command -v npm > /dev/null; then
    echo "npm installation found"
    printf "npm version: %s\n" "$(npm -v)"
else
    echo "npm installation not found. Please install npm version $INSTALL_NPM_VER"
    exit 1
fi

# Process command-line options
while getopts ":cb:" opt; do
    case ${opt} in
        c)
            echo "Cleaning up project"
            rm -rf build dist node_modules
            exit 0
            ;;
        b)
            echo "Option -b was triggered, Argument: ${OPTARG}"
            if [[ "$OPTARG" == "chrome" ]]; then
                echo "Defaulting to chrome"
                browser="chrome"
                mainfest_json="manifest.chrome.json"
            elif [[ "$OPTARG" == "firefox" ]]; then
                echo "Creating firefox manifest.json configuration"
                browser="firefox"
                mainfest_json="manifest.firefox.json"
            else 
                echo "Invalid browser specified. Defaulting to chrome."
                browser="chrome"
                mainfest_json="manifest.chrome.json"
            fi
            ;;
        \?)
            echo "Invalid option: -${OPTARG}" >&2
            exit 1
            ;;
        :)
            echo "Option -${OPTARG} requires an argument." >&2
            exit 1
            ;;
    esac
done

# If no cleanup option was triggered, continue with the build process
echo "Hello, time to automate the build process!"
echo "Installing node modules for browser extension!"
npm install
# Store exit status in variable
status=$?

# Make build directory which will be used as the extension's entry point when loading unpacked
mkdir -p build

# Copy relevant files into the build directory
cp side_panel.html ./build
cp side_panel.css ./build
cp middle.js ./build
cp -r icons/ ./build/icons

# Shane's fido2 client git repository URL
REPO_URL="https://github.com/sbweeden/fido2-node-clients.git"
REPO_DIR="./fido2-node-clients"

# Clone the Git repository if it doesn't exist
if test -d ./$REPO_DIR; then
    echo "fido2-node-client directory already exists"
else
    echo "Cloning fido2-node-client"
    git clone $REPO_URL
fi

cd $REPO_DIR

# Install the node modules
npm install

# Check if user has browserify; if not, install the package
if command -v browserify > /dev/null; then
    echo "browserify installation found"
    printf "browserify version: %s\n" "$(browserify --version)"
else
    echo "browserify installation not found. Installing necessary package now."
    npm install -g browserify
    exit 1
fi

# Bundle Shane's fido2 node client
browserify -s fido fidoutils.js -o bundle.js

# Concatenate the contents of bundle.js and content.js into a new file main.js
cat bundle.js ../content.js > ../build/main.js

# Clean up and create a copy in the certs directory
cp ../copy_generate_attestation_certs.js certs/
cd certs
browserify -s fido copy_generate_attestation_certs.js -o bundle.js
cd ..
cd ..

# Concatenate the contents of bundle.js and background.js into a new file background_script.js
cat $REPO_DIR/certs/bundle.js background.js > ./build/background_script.js
chmod -R +w $REPO_DIR
rm -r $REPO_DIR

# Create the manifest.json configuration
echo "Creating $browser manifest.json configuration"
cat $mainfest_json > ./build/manifest.json
cd build
mkdir -p ../dist

# Build the extension zip file
build_arg="zip ../dist/fido-verse.zip * icons/*"
eval $build_arg
