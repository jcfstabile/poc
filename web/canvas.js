canvas = document.querySelector('canvas')
canvas.width = 500;
canvas.height = 500;
ctx = canvas.getContext('2d')


class Gw{
  constructor(){
    this.objs = [];
  }

  subscribe(obj){
    this.objs.push(obj);
  }

  rect(color, x, y, xw, yw) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, xw, yw);
  }

  clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  controlLeft(obj){
    new LeftControl(obj);
  }

  controlRight(obj){
    new RightControl(obj);
  }

// https://stackoverflow.com/a/6776055
  drawImage(fileName, x, y){
    const img = new Image();
    img.src = fileName;
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
    // option to handle sprite colection
    ctx.drawImage(img, x, y);
  }

  drawAll(){
    console.info('go', this.objs);
    this.clearCanvas();
    this.objs.forEach(obj => obj.$drawImage());
  }
}


class Control{
  constructor(obj){
    this.obj = obj;
    this.setKeys();
    this.addHandleKeydown();
  }


  eventListener(event){
    if (event.defaultPrevented) { return; }
    switch(event.code){
      case this.left:
        this.obj.$left();
        break;
      case this.right:
        this.obj.$right();
        break;
      case this.down:
        this.obj.$down();
        break;
      case this.up:
        this.obj.$up();
        break;
      case this.control:
        this.obj.$control();
        break;
    }
    console.info(event.code);
    // event.preventDefault()
    console.info('requesting');
    requestAnimationFrame(animate);

  }

  addHandleKeydown(){
    // TODO BORRAR evento existente al hacer run, O no se borraran los objetos referenciados!
    // TODO ver como no re add una evento existente.
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
    // removeEventListener('keydown', this.eventListener, false);
    addEventListener('keydown', this.eventListener.bind(this), false);

  }

  removeHandleKeyDown(){
  }
}

class RightControl extends Control{
  setKeys(){
    this.left    = 'ArrowLeft';
    this.right   = 'ArrowRight';
    this.down    = 'ArrowDown';
    this.up      = 'ArrowUp';
    this.control = 'ControlRight';
  }
}

class LeftControl extends Control{
  setKeys(){
    this.left    = 'KeyA';
    this.right   = 'KeyD';
    this.down    = 'KeyS';
    this.up      = 'KeyW';
    this.control = 'ControlLeft';
  }
}

// TODO
// https://stackoverflow.com/questions/3582671/how-to-open-a-local-disk-file-with-javascript
// https://stackoverflow.com/a/26298948
const readFile = file => {
  const oReq = new XMLHttpRequest();
  oReq.addEventListener("load", ()=>{})
  oReq.open("GET", file, false); // false -> synchronously
  oReq.setRequestHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  oReq.send();
  return oReq.responseText;
};

let gw;

let rubyInit = "require 'native'; $gw = Native(`gw`);" + readFile('init.rb')
let rubyEditorCode;

const readEditorCode = editor => {
  rubyEditorCode = editor.getValue();
}

const loadFileCodeOnEditor = editor => {
  editor.setValue(readFile("ejemplo.rb"));
};

const runEditorCode = editor => {
  gw = new Gw();
  readEditorCode(editor);
  runCode();
};

// To handle errors on editor check
// https://stackoverflow.com/questions/32551916/get-the-error-line-in-a-ruby-opal-code
// or better
// https://github.com/opal/opal/tree/master/lib/opal/source_map
const runCode = () => {
  // // crap to redefine, capture and handle console.log
  // function nada(){
  //   console.info('nada');
  //   gw.rect('orange', 159, 159, 159, 158);
  // }
  // window.console.log = nada();
  // // end crap
  try{
    Opal.eval(rubyInit + rubyEditorCode)
  } catch(e) {
    console.log(e); // quiero el error en la consola del front
    alert(e);
  }
  console.info('First animate() call');
  animate();
}

function animate(){
  gw.drawAll();
}


// TODO capture and show inside a box
// https://stackoverflow.com/a/11403146
// Ojo! estando aqui abajo funciona el teclado en el canvas,
// En otro caso puede no funcionar.
window.onload = (function(){
    const oldLog = console.log;
    const consola = document.getElementById('consola');
    console.log = function (message) {
      consola.innerHTML = message;
      // consola.innerHTML = consola.innerHTML + message;
      oldLog.apply(console, arguments);
    };
});

