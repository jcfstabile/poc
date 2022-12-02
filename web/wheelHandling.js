console.log("loading wheelHandling");

const turn = (display) => {
  document.getElementById("executing").style.display = display;
}

const showExecuting = () => {
  const display = 'block';
  turn(display);
  console.log(display);
  console.log("showExecuting");
}

const showDone = () => {
  const display = 'none';
  turn(display);
  console.log("showDone");
}


