navigator.serviceWorker.register("/worker.js")

// This variable will save the event for later use.
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log("beforeinstallprompt")
  // Prevents the default mini-infobar or install dialog from appearing on mobile
  
  // e.preventDefault();
  
  // Save the event because you'll need to trigger it later.
  
  // deferredPrompt = e;
  
  // Show your customized install prompt for your PWA
  // Your own UI doesn't have to be a single element, you
  // can have buttons in different locations, or wait to prompt
  // as part of a critical journey.

  // showInAppInstallPromotion();
});

var boxes = document.getElementsByClassName("button")
for(var i = 0; i < boxes.length; i++) {
  console.log(boxes[i])
  boxes[i].onclick = function (id, evt) { 
    console.log(evt.target.parent)
    if(evt.target.id === "votar") {
      document.location = "/votar.html"
    }
    if(evt.target.id === "back") {
      history.back()
    }
   }.bind(null, boxes[i].id)
}

console.log("INITED")