navigator.serviceWorker.register("/worker.js");
var user = {}
var results = []
console.log(document.location.search);
if (document.location.search === "?logout=true") {
  console.log("clean session");
  localStorage.removeItem("user");
  document.location = "/"
} else {
  if (window.location.origin === "https://democraid.com") {
    var savedUser = localStorage.getItem("user");
    user = savedUser ? JSON.parse(savedUser) : {};
  }
}

var vote;
let scope;
let headers = {};
let endpoint = "https://demv2-brasil-node.cloud.democrachain.org/v2";
let votacionActual;
let votacionBloque

// var user = {
//   iss: "https://accounts.google.com",
//   nbf: 1675051556,
//   aud: "371666599049-0fopffs7jmh4i791o9u6brtqlattvci5.apps.googleusercontent.com",
//   sub: "105410578508952183300",
//   email: "guerrerocarlos@gmail.com",
//   email_verified: true,
//   azp: "371666599049-0fopffs7jmh4i791o9u6brtqlattvci5.apps.googleusercontent.com",
//   name: "Carlos Guerrero",
//   picture:
//     "https://lh3.googleusercontent.com/a/AEdFTp4r1m8LwTxbtef0e3dzyP080lfIX4BzRdoos88kr38=s96-c",
//   given_name: "Carlos",
//   family_name: "Guerrero",
//   iat: 1675051856,
//   exp: 1675055456,
//   jti: "1667688f611703a4df355f549a4b2068dd7c8128",
//   democraid: "ueec5d4c973",
//   keys: {
//     pub: "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnqzVOrjjyTbzT2YtaClsVFNhiraFkzYUnap1U0ZPRN8JqgHlXj1Glh/0rib9foCbkxLduCJO3Hy01ynNAGwNbSGCL3ye81Dtmi9Wvzg0YOxaolxFgHlK42iKMFKisKXIvKWKkYCYKUk01bYk4nRqK+c2ALzUHRsd1SgD9juyacZC/VhwEHIZefwMtGmBYIpoBswEpd9ls9GvpEUTfi75UozjH8K9aZ8i5l1xjjrKq/u5SCzw+mF7mnc+09hN6MXVevhEeEKgUYwPHm1U9w2ulAo8CTUg2BAiWKWaixn52JJQnof1b2HihUVi8xeyuyE6uCc9mytAaqwE/VAFdYATEwIDAQAB-----END PUBLIC KEY-----",
//     priv: "-----BEGIN RSA PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCerNU6uOPJNvNPZi1oKWxUU2GKtoWTNhSdqnVTRk9E3wmqAeVePUaWH/SuJv1+gJuTEt24Ik7cfLTXKc0AbA1tIYIvfJ7zUO2aL1a/ODRg7FqiXEWAeUrjaIowUqKwpci8pYqRgJgpSTTVtiTidGor5zYAvNQdGx3VKAP2O7JpxkL9WHAQchl5/Ay0aYFgimgGzASl32Wz0a+kRRN+LvlSjOMfwr1pnyLmXXGOOsqr+7lILPD6YXuadz7T2E3oxdV6+ER4QqBRjA8ebVT3Da6UCjwJNSDYECJYpZqLGfnYklCeh/VvYeKFRWLzF7K7ITq4Jz2bK0BqrAT9UAV1gBMTAgMBAAECggEAMrBzzbaSzgzH3W1+w++3s5iPaIi2UzjLjTKPGHM1j4LQy4afh2N70SmUOK4r/OWIzYsRWWlcWANeof2wh5n9EAfMVu8wt/n6bW8B/0QtN2lJ6uQfL9OPoOYcfyNm5ZeQcPNROPojoczJHBx72/vkjvHlxoaMHGA1P4rw+RBJBpDWOzHRsdEgiHIoLhSOLiC38ozweMcUIgvgVxvNWFBdQG4gl3zjKHzxjMUbdBk9Xlk+8S3t4G2VQ8k957kgBwMKc9LQ9LcTsUroFkagJbHRLE7C30WL4huEP4zfJ8ht0CdtUkV2bNYXLHEgEhrc6Bl1zrePdaRsVjX9F94BN+rIAQKBgQDcfOX1DmWdd/y4MUzLJweCZsd9RrwX3KMRWf1U83ZPKdLuOA6RxgxBy4zpty1OeOCnh7XkhJ1RfCqpzY7gO6Mtnc4DQsCW+a2cIeYxdEcpRSAWu3AFwvGBRqxWoNG0vJ3GrlXVFHWReicfLTsbaFmBGu7UsJ72E6M+HBQu1PF1kwKBgQC4O0lV45d17HGUF/Bxt2vurrqi4zP4uMJl6IFnoCwf1EPGeAWfsBf9c8BKGYOi2CX18NPLn8mSrFrX7Ecue052SDc046Furqd01KHdBraW8Gtg5sIh7ywNBzMYCLXDGMLHQHk8Arr3HTYtCejtwwB8xEiSn1+PwudIB+7v5AFcgQKBgQC3AmBo2CtV2esFA76m/N1Jyn+Ypyamc7dSRqx0X6R6rs9qdVL6gjVYQ1jSAP31HXXy+Dzs0Xo20WYkDP+jdTzLNylxIW3zoogMiUKlF8udIMgyth+UWKvWTs/rE48cglY/PCL4OwQe3RIt2YAvDp0EAVPtbDB1NfWQLwQ9nvhQSwKBgHadXTsaXIMFJ59Uxm9AzBIRl4KWS/jgY/EfAGoKmz4m+TgIQH6u7tM1OmG7CaDID7DITGS2zR5NL/QDYVUQ+NR47Gp2AJL1ikVTPZ/D2b1Wr5vlFqqohbEhqIjZ2sTw5T9KSIQVsfC2cxIOZlTmjyLFcYBNckZqE2SyDumO4D2BAoGAefG1LdM6hnBme1/Z6WmJ9OtdM+q3ami7oWL33S5MivUkHOoxAH1nARSppymjayyWE9oM0sktaiVrDlZak2PGUeNF76YTv4jZYl+yyxDRONtO5FWdVrZg5qJJYmDWJQObf617NIVNXIjWZNeTKLpj/5FLJ8P3BsSOSHb/+anjJ1c=\n-----END RSA PRIVATE KEY-----",
//   },
// };

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

function setValuesToVote() {
  document.getElementById("voteComunity").innerText = headers.comunity;
  document.getElementById("voteType").innerText = headers.type;
  document.getElementById("voteQuestion").innerText = headers.question;
  document.getElementById("option_1").innerText = headers["option_1"];
  document.getElementById("option_2").innerText = headers["option_2"];
}

function setValuesToParticipaciones() {
  document.getElementById("voteComunity").innerText = headers.comunity;
  document.getElementById("voteType").innerText = headers.type;
  document.getElementById("voteQuestion").innerText = headers.question;
  document.getElementById("option_1_participacion").innerText = headers["option_1"] + ": " + results[0];
  document.getElementById("option_2_participacion").innerText = headers["option_2"] + ": " + results[1]
  document.getElementById("participationHash").innerHTML = `<a href="https://demv2-brasil-node.cloud.democrachain.org/v2/visor/index.html?scope=${headers.block.hash}">${headers.block.hash}</a>`;
}

async function getVoteMetadata() {
  votacionActual = await fetch(
    `${endpoint}/democraid/_/votacionActual`
  );
  votacionActual = await votacionActual.json();
  console.log("votacionActual", votacionActual);

  votacionBloque = await fetch(
    `${endpoint}/_block/${votacionActual.hash}`
  );
  votacionBloque = await votacionBloque.json();
  console.log("votacionBloque", votacionBloque);

  var resultsFetches = []
  resultsFetches.push(fetch(
    `${endpoint}/${votacionActual.hash}/_/votos/si`
  ))
  resultsFetches.push(fetch(
    `${endpoint}/${votacionActual.hash}/_/votos/no`
  ))

  results = await Promise.all((await Promise.all(resultsFetches)).map(async (res) => await res.text()))

  console.log("results", results)

  let lines = votacionBloque.data.split("\n");
  let line = lines.shift();
  while (line.indexOf("//") === 0) {
    line = lines.shift();
    headers[line.split(": ")[0].toLowerCase().replace("// ", "")] =
      line.split(": ")[1];
  }
  headers.block = votacionBloque
}


async function showParticipaciones() {
  showLoading()
  await getVoteMetadata()

  console.log("headers", headers);
  console.log("votacionBloque", votacionBloque);

  setValuesToParticipaciones(headers);
  showAll("pagParticipaciones");
}

async function cargarVotaciones() {
  showLoading()
  await getVoteMetadata()

  console.log("headers", headers);
  console.log("votacionBloque", votacionBloque);

  setValuesToVote(headers);
  showAll("pagVoto");
}

function showLoading() {
  hideAll("pagVoto");
  hideAll("pagMain");
  showAll("pagLoading");
}


var boxes = document.getElementsByClassName("button");
for (var i = 0; i < boxes.length; i++) {
  console.log(boxes[i]);
  boxes[i].onclick = function (id, evt) {
    console.log("click id", id);
    if (id === "votar") {
      cargarVotaciones();
      return 
    }
    if (id === "participaciones") {
      showParticipaciones();
      return 
    }
    if (id === "back") {
      hideAll("pagVoto");
      hideAll("pagParticipaciones");
      showAll("pagMain");
      // history.back();
    }

  }.bind(null, boxes[i].id);
}

async function generateBlock(user, scope, data) {
  let privKey = await getPrivKey(user.keys);
  console.log("privKey", privKey);
  user.keys.endpoint = endpoint;

  let scopeHead = await fetch(`${endpoint}/_head/${scope}`);
  scopeHead = await scopeHead.json();
  console.log("scopeHead", scopeHead);
  if (scopeHead.error) {
    scopeHead = {
      head: "",
      height: 0,
    };
  }

  let votacionBloque = await fetch(
    `${endpoint}/_block/${scope}`
  );
  votacionBloque = await votacionBloque.json();

  let block = {
    prevHash: scopeHead.head,
    height: scopeHead.height + 1,
    version: 2,
    data: `// IMPORT aa99495c112ee6dc549b39df18185fd7043e7dc752f5a53bf4f4c6354786b568\n\n{"voto": "${data}"}`,
    timestamp: new Date().getTime(),
    scope: "aa99495c112ee6dc549b39df18185fd7043e7dc752f5a53bf4f4c6354786b568",
    by: "democraid/" + user.democraid,
    signature: ""
  };

  let sigHash = await getSignatureAndHash(user.keys, block);
  console.log("sigHash", sigHash);

  block.hash = sigHash.correctHash;

  console.log("block:");
  console.log(JSON.stringify(block, null, 2));

  let createResult = await fetch(`${endpoint}/newBlock`, {
    method: "POST",
    body: JSON.stringify(block),
  });

  console.log("💚 createResult", await createResult.json());

  return block;
}

// let votarButton = document.getElementById("votarButton");
// votarButton.classList.add("yellowBox");
// votarButton.onclick = async () => {
//   console.log("ENVIAR VOTO!");
//   hideAll("backButton");
// }

var boxes = document.getElementsByClassName("voteOption");
for (var i = 0; i < boxes.length; i++) {
  console.log(boxes[i]);
  boxes[i].onclick = function (id, evt) {
    hideAll("option-selected");
    showAll("voteOption", "yellowBox");
    voto = headers[id.replace("_selected", "")];
    console.log("voto", voto);
    showAll(id);

    let votarButton = document.getElementById("votarButton");
    votarButton.classList.add("yellowBox");
    votarButton.onclick = async () => {
      console.log("ENVIAR VOTO!");
      hideAll("backButton");
      document.getElementById("votarButtonText").innerText = "ENVIANDO...";
      var boxes = document.getElementsByClassName("voteOption");
      for (var i = 0; i < boxes.length; i++) {
        console.log(boxes[i]);
        boxes[i].onclick = function (id, evt) {};
      }

      var bloque = await generateBlock(user, votacionActual.hash, voto);

      let bloqueResultante = await fetch(
        `${endpoint}/_block/${bloque.hash}`
      );
      bloqueResultante = await bloqueResultante.json();
      console.log("bloqueResultante1", bloqueResultante);
      if (bloqueResultante.error) {
        console.log("Try with failed?");
        bloqueResultante = await fetch(
          `${endpoint}/_failed/${bloque.hash}`
        );
        bloqueResultante = await bloqueResultante.json();
        console.log("bloqueResultante2", bloqueResultante);
      }

      document.getElementById("votarButtonText").innerText =
        bloqueResultante.result || bloqueResultante.__err;
      if (bloqueResultante.__err) {
        document.getElementById("votarButtonText").innerText = document
          .getElementById("votarButtonText")
          .innerText.replace("Error: Error: ", "");
        document.getElementById("votarButton").classList.add("errorColor");
        // setTimeout(() => {
        //   location.reload()
        // }, 5000)
      }

      showAll("backButton");
    };
  }.bind(null, boxes[i].id);
}

var voteButton = document.getElementsByClassName("voteOption");

function hideAll(className, removeMe = "d-none") {
  var boxes = document.getElementsByClassName(className);
  console.log("hiding", boxes);
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].classList.add(removeMe);
  }
}

function showAll(className, addMe = "d-none") {
  hideAll("pagLoading");
  var boxes = document.getElementsByClassName(className);
  console.log("showing", boxes);
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].classList.remove(addMe);
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

  hideAll("pagLoading");
  hideAll("loginUI");
  showAll("pagMain");
}

async function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: ", response.credential);
  let googleUser = await fetch(
    `https://q6qupnjuu3.execute-api.sa-east-1.amazonaws.com/login/google?token=${response.credential}`,
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
    // showParticipaciones(user);
  }
};
