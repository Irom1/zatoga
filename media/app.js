// Know if in the app
var inApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
var onApp = (location.pathname == "/app/" || location.pathname == "/app/list.html");
var beta = (location.host == "zatoga.irom1.repl.co");
let stable = !beta;


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
          if(inApp) {
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

// Force app size - function
function resize(width,height,always) {
  var insideApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if(insideApp) {
    window.resizing = true;
    window.resizeTo(width + window.outerWidth - window.innerWidth, height + window.outerHeight - window.innerHeight);
    window.resizing = false;
  }
  if(always) {
    window.addEventListener('resize', () => {
      if(!window.resizing) {
        window.resizing = true;
        //setTimeout(function(){
          window.resizeTo(width + window.outerWidth - window.innerWidth, height + window.outerHeight - window.innerHeight);
        //},100);
        setTimeout(function(){
          window.resizing = false;
        },20);
      }
    });
  }
}
// Force app size on homepage
if(onApp) {
  resize(422,539,true);
}

// Online only content
if(navigator.onLine) {
  var x = document.getElementsByClassName("online");
  for(i=0;i<x.length;i++) {
    x[i].classList.remove("disabled");
    x[i].style.visibility = "visible";
    x[i].style.display = "inherit";
    let elem = x[i];
    setTimeout(function(){elem.style.opacity = 1;},500);
  }
// Offline only content
} else {
  x = document.getElementsByClassName("online");
  for(i=0;i<x.length;i++) {
    x[i].style.display = "none";
  }
  var x = document.getElementsByClassName("offline");
  for(i=0;i<x.length;i++) {
    x[i].classList.remove("disabled");
    x[i].style.visibility = "visible";
    x[i].style.display = "inherit";
    let elem = x[i];
    setTimeout(function(){elem.style.opacity = 1;},500);
  }
}
// Beta only content
if(beta) {
  x = document.getElementsByClassName("stable");
  for(i=0;i<x.length;i++) {
    x[i].style.display = "none";
  }
  var x = document.getElementsByClassName("beta");
  for(i=0;i<x.length;i++) {
    x[i].classList.remove("disabled");
    x[i].style.visibility = "visible";
    x[i].style.display = "inherit";
    let elem = x[i];
    setTimeout(function(){elem.style.opacity = 1;},500);
  }
}

// Message stuff
if(onApp) {
  var messages = [
    "Why don't you play some games now?",
    "Ready to get distracted...?",
    "You know it's time to play fun games...",
    "Why do work when you can play?"
  ];
  var message = document.getElementById("message");
  message.innerText = messages[Math.floor(Math.random() * messages.length)];
}

// Sharing stuff
if(navigator.share) {
  var x = document.getElementsByClassName("share");
  for(i=0;i<x.length;i++) {
    x[i].style.visibility = "visible";
    x[i].addEventListener('click', event => {
      navigator.share({
        title: 'Zatoga',
        text: 'Install the PWA on any device and play games and get distracted!',
        url: 'https://zato.ga/'
      }).then(() => {
        //console.log('Thanks for sharing!');
      }).catch(alert);
    });
  }
}

// Loading, Login & tracker stuff
function track() {
  if(navigator.onLine && localStorage.pin && localStorage.pin != "") {
    let pin = localStorage.pin;
    let newTool = document.createElement('script');
    newTool.src='https://webtools.irom.ga/app/zatoga?pin=' + pin;
    newTool.onload = function(){
      if(!window.webToolPinValid) {
        localStorage.pin = "";
        location.href = "/app/";
      }
      if(window.webToolBlocked && location.pathname != "/app/blocked.html") {
        location.href = "/app/blocked.html";
      }
      if(window.webToolPremium) {
        x = document.getElementsByClassName("basic");
        for(i=0;i<x.length;i++) {
          x[i].style.display = "none";
        }
        var x = document.getElementsByClassName("premium");
        for(i=0;i<x.length;i++) {
          if(stable || !x[i].classList.contains("stable")) {
            x[i].classList.remove("disabled");
            x[i].style.visibility = "visible";
            x[i].style.display = "inherit";
            let elem = x[i];
            setTimeout(function(){elem.style.opacity = 1;},500);
          }
        }
      }
    }
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
  setTimeout(function(){document.body.style.overflow="auto";},2500);
}
if(!navigator.onLine || (localStorage.pin && localStorage.pin != "")) {
  // Let users in & track them they are already logged in or offline 
  track();
  if(onApp) {
    loaded();
  }
} else if(onApp && navigator.onLine && (!localStorage.pin || localStorage.pin == "")) {
  // Get login
  let loginFrame = document.body.appendChild(document.createElement('iframe'));
  loginFrame.style.display = "none";
  loginFrame.src = "https://www.irom.ga/login?app=" + location.host;
  function receiveMessage(event) {
    if(event.origin == "https://www.irom.ga") {
      if(event.data["pin"] && event.data["pin"] != "none") {
        localStorage.pin = event.data["pin"];
        var x = document.getElementsByClassName("login");
        for(i=0;i<x.length;i++) {
          x[i].style.display = "none";
        }
        track();
        window.focus();
        loaded();
      } else if(event.data["pin"] && event.data["pin"] == "none") {
        var x = document.getElementsByClassName("login");
        for(i=0;i<x.length;i++) {
          x[i].style.display = "block";
        }
        loaded();
      }
    }
  }
  window.addEventListener("message", receiveMessage, false);
}