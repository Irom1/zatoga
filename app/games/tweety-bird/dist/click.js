//var canvas = document.getElementById('bird-game');
function clicker(e) {
  if (e.key === ' ' || e.key === 'Spacebar') {
    alert("You need to tap/click the screen to play - clicking space doesn't work.");
  }
}

// Force app size
var inApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
if(inApp) {
  window.resizeTo(480, 640);
  window.addEventListener('resize', () => {
    window.resizeTo(480, 640);
  });
}