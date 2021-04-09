// Know if in the app
var inApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
var onApp = (location.pathname == "/app/");
var beta = (location.host == "zatoga.irom1.repl.co");

// this event will only fire if the user does not have the pwa installed
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  window.installApp = event;
  document.getElementById("launchApp").style.display = "none";
  document.getElementById("installApp").style.display = "block";
});

// Service worked stuff
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(function(registration) {
		    registration.onupdatefound = function() {
          if(onApp) {
            alert("Updating app...");
            location.reload();
          }
		    }
	    }, function(err) {
		    console.log('ServiceWorker registration failed: ', err);
      });
  })
}
// App install
window.addEventListener('appinstalled', () => {
  location.href = "/app/";
});

// Force app size
if(inApp) {
  window.resizeTo(422, 584);
  window.addEventListener('resize', () => {
    window.resizeTo(422, 584);
  });
}

// Online only content
if(navigator.onLine) {
  var x = document.getElementsByClassName("online");
  for(i=0;i<x.length;i++) {
    x[i].style.display = "block";
  }
}
// Beta only content
if(beta) {
  var x = document.getElementsByClassName("beta");
  for(i=0;i<x.length;i++) {
    x[i].style.display = "inherit";
  }
  var x = document.getElementsByClassName("stable");
  for(i=0;i<x.length;i++) {
    x[i].style.display = "none";
  }
}

// Message stuff
if(onApp) {
  var messages = [
    "There is plenty of time to get stuff done later - why don't you play some games now?",
    "Ready to get distracted...?",
    "Games, anyone?",
    "Why do work when you can play?"
  ];
  var message = document.getElementById("message");
  message.innerText = messages[Math.floor(Math.random() * messages.length)];
  // Prep for v3
  /*var games = [
    {"name":"Doodle Jump","url":"/app/games/doodle-jump/"},
    {"name":"2048 Game","url":"/app/games/2048.html"}
  ];*/
}

// Sharing stuff
if(navigator.share) {
  var x = document.getElementsByClassName("share");
  for(i=0;i<x.length;i++) {
    x[i].style.display = "block";
    x[i].addEventListener('click', event => {
      navigator.share({
        title: 'ZatogaApp',
        text: 'Install the PWA on any device and easily get distracted!',
        url: 'https://zato.ga/'
      }).then(() => {
        console.log('Thanks for sharing!');
      }).catch(console.error);
    });
  }
}

// Loading, Login & tracker stuff
function track() {
  if(navigator.onLine && onApp && localStorage.pin && localStorage.pin != "") {
    let pin = localStorage.pin;
    let newTool = document.createElement('script');
    newTool.src='https://webtools.irom.ga/scripts/nothing?type=script&pin=' + pin;
    document.body.appendChild(newTool);
  }
}
function loaded() {
  var x = document.getElementsByClassName("loading");
  for(i=0;i<x.length;i++) {
    let elem = x[i];
    setTimeout(function(){elem.style.opacity = "0";},1500);
    setTimeout(function(){elem.style.display="none";},2500);
  }
}
if((onApp && localStorage.pin && localStorage.pin != "") || !navigator.onLine) {
  track();
  loaded();
} else if(navigator.onLine && (!localStorage.pin || localStorage.pin == "")) {
  // Get login
  let loginFrame = document.body.appendChild(document.createElement('iframe'));
  loginFrame.style.display = "none";
  loginFrame.src = "https://www.irom.ga/login?app=" + location.host;
  function receiveMessage(event) {
    if(event.origin == "https://www.irom.ga") {
      if(event.data["pin"]) {
        localStorage.pin = event.data["pin"];
        var x = document.getElementsByClassName("login");
        for(i=0;i<x.length;i++) {
          x[i].style.display = "none";
        }
        window.focus();
        loaded();
        track();
      } else {
        loaded();
        var x = document.getElementsByClassName("login");
        for(i=0;i<x.length;i++) {
          x[i].style.display = "block";
        }
      }
    }
  }
  window.addEventListener("message", receiveMessage, false);
}