// Know if in the app
var inApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
var onApp = (location.pathname == "/app/" || location.pathname == "/app/list.html");
var beta = (location.host == "zatoga.irom1.repl.co");
let stable = !beta;

// Add ARC to webpages that are online
if(navigator.onLine) {
  let arcScript = document.createElement("script");
  arcScript.async = true;
  arcScript.src = "https://arc.io/widget.min.js#4Jpe4Zp2";
  document.body.appendChild(arcScript);
}

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
            alert("Updating Zatoga...");
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
    "Why do work when you can play?",
    "Play all the latest games unblocked!",
    "It's the easiest way to have fun!"
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
        text: 'Zatoga - Play all the latest games unblocked- it is the easiest way to have fun!',
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
        document.getElementById("login").style.display = "none";
        window.loggedOut = false;
        track();
        window.focus();
        loaded();
      } else if(event.data["pin"] && event.data["pin"] == "none") {
        window.loggedOut = function(){
          document.getElementById("login").style.display = "block";
          document.body.style.overflow="hidden";
        };
        loaded();
      }
    }
  }
  window.addEventListener("message", receiveMessage, false);
}


// G-Rating Shortcut
      HTMLElement.prototype.onshortcut = function(shortcut, handler) {
    var currentKeys = []
    
    function reset() {
        currentKeys = []
    }

    function shortcutMatches() {
        currentKeys.sort()
        shortcut.sort()

        return (
            JSON.stringify(currentKeys) ==
            JSON.stringify(shortcut)
        )
    }

    this.onkeydown = function(ev) {
        currentKeys.push(ev.key)

        if (shortcutMatches()) {
            ev.preventDefault()
            reset()
            handler(this)
        }

    }

    this.onkeyup = reset
}


document.body.onshortcut(["Alt", "r"], el => {
    alert("Rate Zatoga 5 Stars in Google Search by clicking OK below to have a chance at getting Zatoga Premium. However, if you rate Zatoga anything under 5 stars, you WILL be blocked & banned from Zatoga until you fix your rating. Click OK to be redirected to rate Zatoga and be patient...");
    window.open(
  'https://g.page/r/CU5AkZs-c-2wEBI/review',
  '_blank');
})