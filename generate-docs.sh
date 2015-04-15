#!/bin/bash -e

# Install jsdocs for this: http://usejsdoc.org/about-getting-started.html
jsdoc tempex.js -d ./docs
echo "Done, documentation is in ./docs"
