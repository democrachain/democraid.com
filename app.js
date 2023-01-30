navigator.serviceWorker.register("/worker.js");

var user = {
  iss: "https://accounts.google.com",
  nbf: 1675036818,
  aud: "371666599049-0fopffs7jmh4i791o9u6brtqlattvci5.apps.googleusercontent.com",
  sub: "105410578508952183300",
  email: "guerrerocarlos@gmail.com",
  email_verified: true,
  azp: "371666599049-0fopffs7jmh4i791o9u6brtqlattvci5.apps.googleusercontent.com",
  name: "Carlos Guerrero",
  picture:
    "https://lh3.googleusercontent.com/a/AEdFTp4r1m8LwTxbtef0e3dzyP080lfIX4BzRdoos88kr38=s96-c",
  given_name: "Carlos",
  family_name: "Guerrero",
  iat: 1675037118,
  exp: 1675040718,
  jti: "921280f2cf730d34f8bf6dc332b07b7e69ebd9f7",
  democraid: "ueec5d4c973",
  keys: {
    priv: "-----BEGIN RSA PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDWR1SahFRee/pvhBvxrX/beIFpfOJl4MMMPKawawX0CKEOj48r7HYfx6mS/gU6Hbu/ueY6Dc4oCvk0Oi6brDIj31KQ+CQLqmJLkVVm+ASwvyyN4Ag38qlvfns2vTHUM7+eokj3cA+cW/19mhg+iUFRP0v4g1LkpaAZ7q9izf7TrxEDPMJuo2NGnJIMKw9bHdR41tf3Fk8Kbc66VWZm5IdPRrgATRkulyWo9xhhhQMkf5jPkBciQRbshRs9wwFHq8gKDmOpwCnX0HzB4xV2tOPBD2XlunGsVpyJq5bheId1YQ1ZFCQBV2/ZNZNNdnK92OUvx2ffAhALFdxvuS+/S1rHAgMBAAECggEBAMzPVyVt0HqTA9dtLYx96lSrRP6/+GGqSKQ8oJLFaOZNDSwuuYkhNfLAU+wE0pgu7VKfbFgW8/LAMlviNMRk/XPeNDwOgd2ImPVjz35hF5Kc2Agvl4tqbNr9yOWURrluUPxeX2HqgXFRV+Si0gOMC5uN5Z5+X0/eoz3GL2tAPA61aUjhDkRF0ehwIl70XLD+C4U8nCfBZNtiP8eM06jMNFtBOzsU4vDaR9Wa9jyev5qaQuT1Vau4ncYUXcQZPWZrLdNw7Gxj1j6o2ijh1XoFrz8Z3Z3A/K1wneLikHQUmlOk90ard/FQu6nD8wGKqDgw5KmRLAPmabyfXKydqqcuduECgYEA9ejrDqDAnCyOlfQd7B/RH3cYR5O7IFUK+Cf1xnzA748rfmyHxXZaYeM98ppIJJ/yg9hfmQiFneZqIslSXA8pomUEE4i0+lhmicrFJG6r6o4i61sFak75mueQeAF2awnNwOv87F4zRBcJHsxZYdGTKiHASWTdaswV3v0nS/DMRVECgYEA3xInAdX8SWQwS0ZjaTdfkc1Y5UTf7ksqiK/N1gqc9yZ8aBRVDxqMTIEVHwdTo8wn+AWo5ySOmQ6pmYuvg66Str9T1bEjbxPrPDBxN2Thx7V5uRmHi5QWks9ZTb1V9TPUnBVDQxwYT6m0HuvL1YrqqVYzdlrYRv4W15NP0E8o+JcCgYEAlxk4HXPfBddHAZLPNABU0d2u2IRIrdQzekmrdfu/3TL+iZ8MSeOwI4eqz7/G5mI1dJfmHbUjzOMAgkFrzs8uSO+C8rHEajMZRj+GpR0vm18cy7rQ+AJw0qLInURgy+JpP8qBTYeQPp1c6ESuAzHwGCpG6ZIFjxK5uZuZosrh6RECgYABPE2BAhlqoqZt1E76pzbdTODgLDh9TmdG6IpgVCC4cbsgrHQoKEJ8rf5a9KRu9NOH2SgtV5N+n4kq844eUZo4bujc9yU2GUslQzNtVh62B3hMISsSB9j0KTfaaWEPgaD82FVOCtrLnioEPdQcM6/HDlYsoqYuBnxD52n6wmV8swKBgQD0wM+yaLDQotApoXdHUFbu3oFqdHHF/cA4vs08tJvCH0SxYWd+3n9jj7QrUMEANq2s+1YRsZjKcN1U3qCa372IVnXMzyIrc+yNR62sbRWtL6JcXXzUy+yUf97fNIu+rbRmHjTD1B+2SMPMRNPXMFlKumnV8LqkliwUZXj9IwgZ+g==\n-----END RSA PRIVATE KEY-----",
    pub: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1kdUmoRUXnv6b4Qb8a1/23iBaXziZeDDDDymsGsF9AihDo+PK+x2H8epkv4FOh27v7nmOg3OKAr5NDoum6wyI99SkPgkC6piS5FVZvgEsL8sjeAIN/Kpb357Nr0x1DO/nqJI93APnFv9fZoYPolBUT9L+INS5KWgGe6vYs3+068RAzzCbqNjRpySDCsPWx3UeNbX9xZPCm3OulVmZuSHT0a4AE0ZLpclqPcYYYUDJH+Yz5AXIkEW7IUbPcMBR6vICg5jqcAp19B8weMVdrTjwQ9l5bpxrFaciauW4XiHdWENWRQkAVdv2TWTTXZyvdjlL8dn3wIQCxXcb7kvv0taxwIDAQAB\n-----END PUBLIC KEY-----",
  },
};

if(window.location.origin === 'https://democraid.com') {
  var savedUser = localStorage.getItem("user")
  user = savedUser ? JSON.parse(savedUser) : {};
} 

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
  console.log("hiding", boxes);
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].classList.add("d-none");
  }
}

function showAll(className) {
  var boxes = document.getElementsByClassName(className);
  console.log("showing", boxes);
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].classList.remove("d-none");
  }
}

console.log("INITED");

function setValuesToUI(user) {
  document.getElementById("userPicture").src = user.picture;
  document.getElementById("given_name").innerText = user.given_name;
  document.getElementById("user_id").innerText = user.democraid;
  // document.getElementById("family_name").innerText = user.family_name;
  document.getElementById("googleLoginButton").style = "display: none;";
  // document.getElementById("userPicture").style = "display: block;";

  hideAll("loginUI");
  showAll("pagMain");
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

  console.log("user", user);

  if (user.email) {
    localStorage.setItem("user", JSON.stringify(user));
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
    showAll("loginUI");
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
