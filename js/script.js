/*
window.addEventListener("load", function() {
  let userChoice = this.window.confirm("This window is ment to be viewed on a 1920x1080 monitor. While others will work it wont be the intened viewing experience. Do you wish to continue?");
  if(userChoice) {
    console.log("is fine with the constraints");
  }
  else {
    console.log("wishes to switch themes");
  }
});
*/

let recycleBin = document.getElementById("recycleBin");


const modal = document.getElementById("modal");
const imgNet = document.getElementById("icon3");
const close = document.querySelector(".close");

imgNet.onclick = () => modal.style.display = "block";
close.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};
