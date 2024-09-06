#!/bin/bash

source "../versions.sh"

echo Grabing needed CDNs

function grabCDN(){
    url=$1;
    if [ ! -f "${url##*/}" ]; then # grab if file do not exist (no matter which version
        wget "$1";
    fi
}

cd web
grabCDN "https://cdn.opalrb.com/opal/${opal_version}/opal.js"
grabCDN "https://cdn.opalrb.com/opal/${opal_version}/opal-parser.js"
grabCDN "https://cdn.opalrb.com/opal/${opal_version}/native.js"

grabCDN "https://cdnjs.cloudflare.com/ajax/libs/ace/${ace_version}/ace.min.js"
grabCDN "https://cdnjs.cloudflare.com/ajax/libs/ace/${ace_version}/mode-ruby.min.js"
grabCDN "https://cdnjs.cloudflare.com/ajax/libs/ace/${ace_version}/theme-cobalt.min.js"
grabCDN "https://cdnjs.cloudflare.com/ajax/libs/ace/${ace_version}/ext-settings_menu.min.js"
grabCDN "https://cdnjs.cloudflare.com/ajax/libs/ace/${ace_version}/keybinding-vim.min.js"
cd ..
