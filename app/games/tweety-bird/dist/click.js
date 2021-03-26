var canvas = document.getElementById('bird-game');
function clicker(e) {
  if (e.key === ' ' || e.key === 'Spacebar') {
    alert("You need to tap to play - clicking space doesn't work.");
  }
}