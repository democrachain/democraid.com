navigator.serviceWorker.register("/worker.js");
var user = {};
var registry = {};
var results = [];
let registryData = {};

console.log(document.location.search);

var vote;
let scope;
let headers = {};
let endpoint = "https://demv2-brasil-node.cloud.democrachain.org/v2";
let votacionActual;
let votacionBloque;

let authServer = "https://secure.cloud.democraid.com";

let datosPersonales = {
  cedula: {
    type: "text",
    label: "Cedula de Identidad",
    label: "Cedula de Identidad",
    attribs: {
      disabled: true,
    },
  },
  nombre: {
    type: "text",
    label: "Nombres y Apellidos",
    attribs: {
      disabled: true,
    },
  },
  telefono: {
    type: "text",
    label: "Teléfono de contacto",
  },
  nota: {
    type: "text",
    label: "Nota / Comentario",
  },
  estado: {
    type: "list",
    label: "Estado",
    exLabel: "Región",
    params: () => `_edo=yes`,
    onChange: (evt) => {
      console.log("Estado change", evt);
    },
  },
  municipio: {
    type: "list",
    label: "Municipio",
    exLabel: "País",
    params: (s) => `edo=${s.estado}&_mun=yes`,
  },
  parroquia: {
    type: "list",
    label: "Parroquia",
    exLabel: "Ciudad",
    params: (s) => `mun=${s.municipio}&_par=yes`,
  },
};

// cedula: "V-18979787";
// centro: "ESCUELA BASICA ESTADAL GUSTAVO FUENMAYOR";
// direccion: "SECTOR AVENIDA PRINCIPAL  LA ROSA VIEJA FRENTE AVENIDA PRINCIPAL. DERECHA CALLE EL PORVENIR. IZQUIERDA CALLE GUSTAVO FUENMAYOR AVENIDA PRINCIPAL ROSA VIEJA CABIMAS AL LADO DE LA IGLESIA SAN JUAN BAUTISTA CASA";
// estado: "EDO. ZULIA";
// municipio: "MP. CABIMAS";
// nombre: "GLEXIS CAROLINA CAMACHO OROPEZA";
// parroquia: "PQ. LA ROSA";

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
  document.getElementById("option_1_participacion").innerText =
    headers["option_1"] + ": " + results[0];
  document.getElementById("option_2_participacion").innerText =
    headers["option_2"] + ": " + results[1];
  document.getElementById(
    "participationHash"
  ).innerHTML = `<a href="https://demv2-brasil-node.cloud.democrachain.org/v2/visor/index.html?scope=${headers.block.hash}">${headers.block.hash}</a>`;
}

async function getVoteMetadata() {
  votacionActual = await fetch(`${endpoint}/democraid/_/votacionActual`);
  votacionActual = await votacionActual.json();
  console.log("votacionActual", votacionActual);

  votacionBloque = await fetch(`${endpoint}/_block/${votacionActual.hash}`);
  votacionBloque = await votacionBloque.json();
  console.log("votacionBloque", votacionBloque);

  var resultsFetches = [];
  resultsFetches.push(fetch(`${endpoint}/${votacionActual.hash}/_/votos/si`));
  resultsFetches.push(fetch(`${endpoint}/${votacionActual.hash}/_/votos/no`));

  results = await Promise.all(
    (await Promise.all(resultsFetches)).map(async (res) => await res.text())
  );

  console.log("results", results);

  let lines = votacionBloque.data.split("\n");
  let line = lines.shift();
  while (line.indexOf("//") === 0) {
    line = lines.shift();
    headers[line.split(": ")[0].toLowerCase().replace("// ", "")] =
      line.split(": ")[1];
  }
  headers.block = votacionBloque;
}

async function showParticipaciones() {
  showLoading();
  await getVoteMetadata();

  console.log("headers", headers);
  console.log("votacionBloque", votacionBloque);

  setValuesToParticipaciones(headers);
  showAll("pagParticipaciones");
}

async function cargarVotaciones() {
  showLoading();
  await getVoteMetadata();

  console.log("headers", headers);
  console.log("votacionBloque", votacionBloque);

  setValuesToVote(headers);
  showAll("pagVoto");
}

async function fetchList(listEl, currentData) {
  let list = await fetch(authServer + "/centro?" + listEl.params(currentData), {
    credentials: "include",
  });

  return await list.json();
}

function showLoading() {
  hideAll("pagVoto");
  hideAll("pagMain");
  hideAll("pagDatos");
  showAll("pagLoading");
}

function changeHandler(evt) {
  document.getElementById("guardarDatos").classList.add("yellowBox");
  console.log("changeHandler", evt.target);
  let attrib = evt.target.id.replace("input", "");
  registryData[attrib] = evt.target.value;

  if (attrib === "estado") {
    registryData.municipio = "";
    document.getElementById("piecemunicipio").remove();
    registryData.parroquia = "";
    document.getElementById("pieceparroquia").remove();
  }

  if (attrib === "municipio") {
    registryData.parroquia = "";
    document.getElementById("pieceparroquia").remove();
  }

  showDatos();
}

async function showDatos() {
  hideAll("pagVoto");
  hideAll("pagMain");
  hideAll("pagLoading");
  console.log("registryData", registryData);
  showAll("pagDatos");

  if (registryData.cedula) {
    document.getElementById("buscarUI").classList.add("d-none");
    document.getElementById("actualizarUI").classList.remove("d-none");

    let datosForm = document.getElementById("datosForm");
    // datosForm.replaceChildren();
    // for (let piece in datosPersonales) {
    for (let piece in datosPersonales) {
      let existingPiece = document.getElementById("piece" + piece);
      if (!existingPiece) {
        let pieceDiv = document.createElement("div");
        pieceDiv.id = "piece" + piece;
        let labelDiv = document.createElement("div");
        pieceDiv.appendChild(labelDiv);

        if (datosPersonales[piece].type === "text") {
          let inputDiv = document.createElement("input");
          inputDiv.id = "input" + piece;
          if (datosPersonales[piece].defaultValue) {
            inputDiv.value = datosPersonales[piece].defaultValue;
          }
          if (registryData[piece]) {
            inputDiv.value = registryData[piece];
          }
          if (datosPersonales[piece].attribs) {
            Object.keys(datosPersonales[piece].attribs).forEach((key) => {
              inputDiv[key] = datosPersonales[piece].attribs[key];
            });
          }
          labelDiv.innerText = datosPersonales[piece].label;

          pieceDiv.appendChild(inputDiv);
        }

        if (datosPersonales[piece].type === "list") {
          let listFromServer = await fetchList(
            datosPersonales[piece],
            registryData
          );
          listFromServer = listFromServer
            .filter((e) => e.length > 1)
            .sort((a, b) => (a > b ? 1 : -1))
            .map((e) => e.toUpperCase());

          console.log("listFromServer", listFromServer.length, listFromServer);

          if (listFromServer.length > 0) {
            let inputEl = document.createElement("select");
            inputEl.id = "input" + piece;

            if (registryData[piece] === "") {
              registryData[piece] = listFromServer[0];
            }

            for (var val of listFromServer) {
              let inputOption = document.createElement("option");
              inputOption.value = val;
              inputOption.innerText = val;
              if (registryData[piece] === val) {
                inputOption.selected = "true";
              }
              inputEl.appendChild(inputOption);
            }

            inputEl.onchange = changeHandler;
            labelDiv.innerText =
              registryData.estado === "EXTERIOR"
                ? datosPersonales[piece].exLabel
                : datosPersonales[piece].label;
            pieceDiv.appendChild(inputEl);
          }
        }

        datosForm.appendChild(pieceDiv);
      }
    }
  }
}

var busy = false;
var buttonHandler = async function (id, evt) {
  if (!busy && !evt.target.classList.contains("disabledBox")) {
    try {
      console.log("click id", id);
      busy = true;
      if (id === "loginButton") {
        let email = document.getElementById("email");
        if (
          email.value.length > 0 &&
          email.value.indexOf("@") > 0 &&
          email.value.indexOf(".") > 0
        ) {
          document.location = `${authServer}?email=${email.value}`;
        }
      }

      if (id === "votar") {
        cargarVotaciones();
      }
      if (id === "participaciones") {
        showParticipaciones();
      }
      if (id === "participaciones") {
        showParticipaciones();
      }

      if (id === "closeSession") {
        evt.target.innerHTML = "<img src='/img/spinner.gif'>";
        location.href = authServer + `/logout`;
      }

      if (id === "datos") {
        showDatos();
      }
      if (id === "buscarCedula") {
        evt.target.innerHTML = "<img src='/img/spinner.gif'>";
        setTimeout(() => {
          evt.target.innerHTML = "Buscar";
        }, 5000);

        let cedulaResponse = await fetch(
          authServer +
            `/registro?cedula=${document.getElementById("searchCedula").value}`,
          {
            credentials: "include",
          }
        );
        registryData = await cedulaResponse.json();
        console.log("registryData", registryData);
        showDatos();
      }
      if (id === "guardarDatos") {
        let datosPayload = {};
        evt.target.innerHTML = "<img src='/img/spinner.gif'>";
        document.getElementById("guardarDatos").classList.remove("yellowBox");

        setTimeout(() => {
          evt.target.innerHTML = "Actualizar";
        }, 10000);

        for (let piece in datosPersonales) {
          datosPayload[piece] = document.getElementById("input" + piece).value;
        }
        console.log("UPDATE: datosPayload", datosPayload);
        await fetch(authServer + `/storage`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ registro: datosPayload }, null, 2),
        });
        evt.target.innerHTML = "Actualizado!";
      }
      if(id === "backReload") {
        return location.reload()
      }
      if (id === "back") {
        hideAll("pagVoto");
        hideAll("pagDatos");
        hideAll("pagParticipaciones");
        showAll("pagMain");
        // history.back();
      }
    } catch (err) {
      console.log(err);
    } finally {
      busy = false;
    }
  }
};

var boxes = document.getElementsByClassName("button");
for (var i = 0; i < boxes.length; i++) {
  console.log(boxes[i]);
  boxes[i].onclick = buttonHandler.bind(null, boxes[i].id);
}

async function generateBlock(user, scope, data) {
  console.log("generateBlock", user.keys);
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

  let votacionBloque = await fetch(`${endpoint}/_block/${scope}`);
  votacionBloque = await votacionBloque.json();

  let block = {
    prevHash: scopeHead.head,
    height: scopeHead.height + 1,
    version: 2,
    data: `// IMPORT aa99495c112ee6dc549b39df18185fd7043e7dc752f5a53bf4f4c6354786b568\n\n{"voto": "${data}"}`,
    timestamp: new Date().getTime(),
    scope: "aa99495c112ee6dc549b39df18185fd7043e7dc752f5a53bf4f4c6354786b568",
    by: "democraid/" + user.democraid,
    signature: "",
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

      let bloqueResultante = await fetch(`${endpoint}/_block/${bloque.hash}`);
      bloqueResultante = await bloqueResultante.json();
      console.log("bloqueResultante1", bloqueResultante);
      if (bloqueResultante.error) {
        console.log("Try with failed?");
        bloqueResultante = await fetch(`${endpoint}/_failed/${bloque.hash}`);
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
  console.log("showAll", className);
  hideAll("pagLoading");
  var boxes = document.getElementsByClassName(className);
  console.log("showing", boxes);
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].classList.remove(addMe);
  }
}

function setValuesToUI(user) {
  if (user.picture) {
    document.getElementById("userPicture").src = user.picture;
  }
  document.getElementById("top_message").innerText = "Bienvenido";
  document.getElementById("user_id").innerText = user.democraid;
  // document.getElementById("family_name").innerText = user.family_name;
  // document.getElementById("googleLoginButton").style = "display: none;";
  // document.getElementById("userPicture").style = "display: block;";

  hideAll("pagLoading");
  hideAll("pagLogin");
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

  if (document.location.search === "?logout=true") {
    console.log("clean session");
    localStorage.removeItem("user");
    document.location = "/";
    await fetch(authServer + `/logout`);
  } else {
    if (window.location.origin === "https://democraid.com") {
      var savedUser = localStorage.getItem("user");
      user = savedUser ? JSON.parse(savedUser) : {};
    }
  }

  try {
    user = await fetch(authServer + `/session.json`, {
      credentials: "include",
    });

    user = await user.json();
    console.log("USER", user);

    if (user.email) {
      setValuesToUI(user);

      registry = await fetch(authServer + `/registry.json`, {
        credentials: "include",
      });
      registry = await registry.json();
      console.log("registry2", registry);
      registryData = registry.registro;
      document.getElementById("datos").classList.remove("disabledBox");

      if (registry.registro) {
        document.getElementById("top_message").innerText =
          registry.registro.cedula;
        document.getElementById("votar").classList.remove("disabledBox");
      } else {
        document.getElementById("top_message").innerText =
        "Bienvenido";
      }
    } else {
      showAll("pagLogin");
    }
  } catch (err) {
    console.log("err23231", err, err.stack);
    document.getElementById("loading").innerHTML = "Error...";
  }

  // buttonHandler("datos");
  // setTimeout(buttonHandler("buscarCedula"), 2000);
};
