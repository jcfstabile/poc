echo Grabing needed CDNs

function loadCDN(){
    url=$1;
    if [ ! -f "${url##*/}" ]; then
        wget "$1";
    fi
}

cd web
loadCDN "https://cdn.opalrb.com/opal/current/opal.js"
loadCDN "https://cdn.opalrb.com/opal/current/native.js"

loadCDN "https://cdnjs.cloudflare.com/ajax/libs/ace/1.8.1/ace.min.js"
loadCDN "https://cdnjs.cloudflare.com/ajax/libs/ace/1.8.1/mode-ruby.min.js"
loadCDN "https://cdnjs.cloudflare.com/ajax/libs/ace/1.8.1/theme-cobalt.min.js"
loadCDN "https://cdnjs.cloudflare.com/ajax/libs/ace/1.8.1/ext-settings_menu.min.js"
loadCDN "https://cdnjs.cloudflare.com/ajax/libs/ace/1.8.1/keybinding-vim.min.js"
cd ..
