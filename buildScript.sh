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

# Clean up options
while getopts ":c" opt; do
    case ${opt} in
        c)
            echo "Cleaning up project"
            rm -rf build dist node_modules
            exit 0
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

# This script automates the build process for the fido2 browser extension
echo "Hello, time to automate the build process!"
echo "Installing node modules for browser extension!"
# Install required packages such as uuid
npm install
# Store exit status in variable
status=$?

# Make build directory which will be used as the extensions entry point when loading unpacked
mkdir -p build

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
# echo "Cloning repository..."

if test -d ./$REPO_DIR; then
    echo "fido2-node-client directory already exists"
else
    echo "cloning fido2-node-client"
    git clone $REPO_URL
fi

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
cat bundle.js ../content.js > ../build/main.js


# Different OS types
# case "$OSTYPE" in
#   solaris*) echo "SOLARIS" ;;
#   darwin*)  echo "OSX" ;; 
#   linux*)   echo "LINUX" ;;
#   bsd*)     echo "BSD" ;;
#   msys*)    echo "WINDOWS" ;;
#   cygwin*)  echo "ALSO WINDOWS" ;;
#   *)        echo "unknown: $OSTYPE" ;;
# esac


# Find the fidoutilsConfig variable and replace with hardcoded object
# sed -i -e '/let fidoutilsConfig =.*/,+5d' main.js

# sed -i -e '' "/let fidoutilsConfig =.*/,+5d =$FIDO_UTILS_CONFIG/" ../main.js

# sed -i -e '/let fidoutilsConfig =.*/,+4d' ../main.js
# sed -i "" -e '/let fidoutilsConfig =.*/{n;N;N;N;d;}' ../build/main.js


# SED_CMD="sed -i -e '/let fidoutilsConfig =.*/{n;N;N;N;d;}' ../build/main.js"
# echo $OSTYPE
# if [[ "$OSTYPE" == 'darwin'* ]]; then
#     echo "macOS"
#     SED_CMD="sed -i \"\" -e '/let fidoutilsConfig =.*/{n;N;N;N;d;}' ../build/main.js"
# fi
# eval $SED_CMD

python3 << EOL
input_file_name = "../build/main.js"
input_file = open(input_file_name, 'r')
lines = input_file.readlines()
i = 0
out = []
while i < len(lines):
    l = lines[i]
    if l.startswith('let fidoutilsConfig ='):
        out.append(l)
        i += 1
        i += 4
    else:
        out.append(l)
        i += 1
output_file = open(input_file_name, 'w')
output_file.writelines(out)
EOL

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
cat $REPO_DIR/certs/bundle.js background.js > ./build/background_script.js
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
browser="chrome"
mainfest_json="manifest.chrome.json"


while getopts "b:" opt; do
    case ${opt} in
        b) 
            echo "Option -b was triggered, Argument: ${OPTARG}"
            if [[ "$OPTARG" == "chrome" ]]; then
                # echo "Creating chrome manifest.json configuration"
                # cat manifest.chrome.json >> ./build/manifest.json
                # cd build
                # web-ext -a ../dist build
                # chrome.exe --pack-extension
                # chrome --pack-extension="ibm-security-passkey"
                echo "Defaulting to chrome"
                break;

            elif [[ "$OPTARG" == "firefox" ]]; then
                echo "Creating firefox manifest.json configuration"
                # cat manifest.firefox.json >> ./build/manifest.json
                # cd build
                # web-ext -a ../dist build
                browser="firefox"
                mainfest_json="manifest.firefox.json"
                break;
            else 
                echo "Defaulting to chrome manifest.json configuration"
                # cat manifest.chrome.json >> ./build/manifest.json
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
# shift $((OPTIND-1))

echo "Creating $browser manifest.json configuration"
cat $mainfest_json > ./build/manifest.json
cd build
mkdir -p ../dist

build_arg="zip ../dist/fido-verse.zip * icons/*"
eval $build_arg

# Call getopts to trigger cleanup and delete build, dist and node_modules directories
# optspec="-:"
# while getopts "$optspec" optchar; do
#     case "${optchar}" in
#         -)
#             case "${OPTARG}" in
#                 cleanup)
#                     echo "Cleaning up project"
#                     rmdir -rf build
#                     rmdir -rf dist
#                     rmdir -rf node_modules
#                     ;;
#             esac;;
#     esac
# done



