console.log("loading toggleKeyBinding");
const vim = 'ace/keyboard/vim';
const def = editor.getKeyboardHandler();
var kbh = def;
const toggleKeyBinding = () => {
  kbh = kbh === vim ? def : vim;
  editor.setKeyboardHandler(kbh);
  if(kbh === vim){
    showDone();
  } else {
    showExecuting();
  }
}

