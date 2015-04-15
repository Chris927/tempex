#!/bin/bash -e

# Install jsdocs for this: http://usejsdoc.org/about-getting-started.html
jsdoc tempex.js -d ./docs
echo "Done, documentation is in ./docs"

# after that:
# git checkout gh-pages
# git rebase master
# TODO: maybe run 'jsdoc now'?
# git add docs
# git commit ...
# git subtree push --prefix docs origin gh-pages
