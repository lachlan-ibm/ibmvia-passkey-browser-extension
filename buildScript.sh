#!/bin/bash
# This script automates the build process for the fido2 browser extension
echo "Hello, time to automate the build process!"

# Shane's fido2 client git repository url
REPO_URL="https://github.com/sbweeden/fido2-node-clients.git"
MY_PATH=
REPO_DIR="./fido2-node-clients"
# Clone the Git repository
echo "Cloning repository..."
git clone $REPO_URL

echo "Changed into repo"




