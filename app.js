navigator.serviceWorker.register("/worker.js");
var user = localStorage.getItem('user') || {}

// This variable will save the event for later use.
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("beforeinstallprompt");
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

var boxes = document.getElementsByClassName("button");
for (var i = 0; i < boxes.length; i++) {
  console.log(boxes[i]);
  boxes[i].onclick = function (id, evt) {
    console.log(evt.target.parent);
    if (evt.target.id === "votar") {
      document.location = "/votar.html";
    }
    if (evt.target.id === "back") {
      history.back();
    }
  }.bind(null, boxes[i].id);
}

function hideAll(className) {
  var boxes = document.getElementsByClassName(className);
  console.log("hiding", boxes)
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].classList.add("d-none")
  }
}

function showAll(className) {
  var boxes = document.getElementsByClassName(className);
  console.log("showing", boxes)
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].classList.remove("d-none")
  }
}

console.log("INITED");

function setValuesToUI(user) {
  document.getElementById("userPicture").src = user.picture;
  document.getElementById("given_name").innerText = user.given_name;
  // document.getElementById("family_name").innerText = user.family_name;
  document.getElementById("googleLoginButton").style = "display: none;";
  // document.getElementById("userPicture").style = "display: block;";

  hideAll("loginUI")
  showAll("pagMain")

}

async function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: ", response.credential);
  let googleUser = await fetch(
    `https://auth.cloud.democraid.com/login/google?token=${response.credential}`,
    {
      credentials: "include",
    }
  );
  user = await googleUser.json();

  console.log("user", user)

  if (user.email) {
    localStorage.setItem("user", JSON.stringify(user))
    setValuesToUI(user);
  }
}

window.onload = async function () {
  console.log("LOAD!");
  // let userResponse = await fetch(`https://auth.cloud.democraid.com/user.json`, {
  //   credentials: "include",
  // });
  // user = await userResponse.json();

  // console.log("USER", user);

  // main();

  if (!user.email) {
    google.accounts.id.initialize({
      client_id:
        "371666599049-0fopffs7jmh4i791o9u6brtqlattvci5.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleLoginButton"),
      { theme: "outline" }
    );

    // setTimeout(() => {
    //   console.log("prompt!");
    //   google.accounts.id.prompt((notification) => {
    //     console.log(
    //       "notification.isNotDisplayed()",
    //       notification.isNotDisplayed()
    //     );
    //     console.log(
    //       "notification.isSkippedMoment()",
    //       notification.isSkippedMoment()
    //     );
    //     if (
    //       notification.isNotDisplayed() ||
    //       notification.isSkippedMoment()
    //     ) {
    //       google.accounts.id.renderButton(
    //         document.getElementById("googleLoginButton"),
    //         { theme: "outline" }
    //       );
    //     }
    //   }); // also display the One Tap dialog
    // }, 1000);
  } else {
    setValuesToUI(user);
  }
};
