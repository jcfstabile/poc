input = document.querySelector('input');
input.addEventListener('change', () => {
  const file = input.files[0];
  if (file) { getFile(file); }
});

const readLocalFile = () => {
  input.click();
}


const getFile = file => {
  const fileReader = new FileReader();
  fileReader.readAsText(file);
  fileReader.addEventListener('loadend', loaded);
}

const loaded = e => {
  editor.setValue(e.target.result);
}
