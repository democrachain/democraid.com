let pubKeys = {};

function getBlock(params) {
  return fetch(`${params.endpoint}/_block/${params.hash}`).then(function (
    response
  ) {
    return response.json();
  });
}
function removeLines(str) {
  return str.replace("\n", "");
}
function pemToArrayBufferPublic(pem) {
  var b64Lines = removeLines(pem);
  var b64Prefix = b64Lines.replace("-----BEGIN PUBLIC KEY-----", "");
  var b64Final = b64Prefix.replace("-----END PUBLIC KEY-----", "");

  return base64ToArrayBuffer(b64Final);
}

function pemToArrayBufferPrivate(pem) {
  var b64Lines = removeLines(pem);
  var b64Prefix = b64Lines.replace("-----BEGIN RSA PRIVATE KEY-----", "");
  var b64Final = b64Prefix.replace("-----END RSA PRIVATE KEY-----", "");

  return base64ToArrayBuffer(b64Final);
}

async function getPubKey(params, block) {
  let rawKey;
  // if (params.pub) {
  //   rawKey = params.pub;
  // } else {
  if (pubKeys[block.by]) {
    return pubKeys[block.by];
  }
  console.log(`${params.endpoint}/_keys/${block.by}.pub.key`);
  let response = await fetch(`${params.endpoint}/_keys/${block.by}.pub.key`);
  rawKey = await response.json();
  // }

  console.log(">>> PUB rawKey", rawKey);

  let importedKey = await window.crypto.subtle.importKey(
    "spki",
    pemToArrayBufferPublic(rawKey),
    {
      name: "RSA-PSS",
      hash: { name: "SHA-256" },
    },
    false,
    ["verify"]
  );
  // if (!params.pub) {
  pubKeys[block.by] = importedKey;
  // }
  console.log("importedKey", importedKey);
  return importedKey;
}

async function getPrivKey(params) {
  console.log(">>> PUB rawKey", params.priv);

  let importedPrivKey = await window.crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBufferPrivate(params.priv),
    {
      name: "RSA-PSS",
      hash: { name: "SHA-256" },
    },
    false,
    ["sign"]
  );

  console.log("💋 💋 💋 💋 ", importedPrivKey);

  return importedPrivKey;
}

function base64ToArrayBuffer(b64) {
  console.log("base64ToArrayBuffer>>", b64);

  var byteString = atob(b64);
  var byteArray = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  return byteArray;
}

function buf2hex(buffer) {
  // buffer is an ArrayBuffer
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

// async function getAndProcessBlock(params) {
//   // let self = this
//   console.log("got block", block);
//   block.size = JSON.stringify(block).length;
//   let holdHash = block.hash;
//   console.log(":::", holdHash);

//   let publicKey = await getPubKey(params, block);

//   const encoder = new TextEncoder();
//   const algorithmParameters = {
//     name: "RSA-PSS",
//     saltLength: 128, //the length of the salt
//   };

//   console.log("BLOCK.signature", block.signature);

//   let blockToVerify = {
//     prevHash: block.prevHash,
//     height: block.height,
//     version: block.version,
//     data: block.data,
//     timestamp: block.timestamp,
//     scope: block.scope,
//   };

//   let signature_verified = await window.crypto.subtle.verify(
//     algorithmParameters,
//     publicKey,
//     base64ToArrayBuffer(block.signature),
//     encoder.encode(JSON.stringify(blockToVerify, null, 2))
//   );

//   blockToVerify = {
//     prevHash: block.prevHash,
//     height: block.height,
//     version: block.version,
//     data: block.data,
//     timestamp: block.timestamp,
//     scope: block.scope,
//     signature: block.signature,
//     by: block.by,
//     rootPrevHash: block.rootPrevHash,
//     rootHeight: block.rootHeight,
//   };

//   // let originalBlock = Object.assign({}, block)
//   // delete block["hash"]

//   const encoderHash = new TextEncoder();
//   const digest = await window.crypto.subtle.digest(
//     "SHA-256",
//     encoderHash.encode(JSON.stringify(blockToVerify))
//   );
//   const hexDigest = buf2hex(new Uint8Array(digest).buffer);
//   console.log(":::HAD:", block.hash);
//   console.log(":::GOT:", hexDigest);
//   // block.hash_verified = hexDigest === block.hash;

//   console.log("SIGN VERIFIED:", signature_verified);
//   console.log("HASH VERIFIED:", hexDigest === block.hash);

//   // block.hash = holdHash
//   // console.log("verified", block.signature_verified, block.hash_verified)

//   // block.prettyDate = new Date(block.timestamp / 1)
//   //   .toISOString()
//   //   .replace("T", " ");
//   // block.prettyDateLong = block.date.toLocaleString() + ` (GMT${block.date.getTimezoneOffset()})`

//   // block.body = addLineBreaks(block.data);

//   // self.blocksPerHash[block.rootHash] = block
//   // params.listOfBlocks.push(block)
//   // let keys = addBlock(block)

//   // if (block.rootPrevHash !== "" && !keys.includes(block.rootPrevHash)) {
//   //   params.hash = block.rootPrevHash
//   //   return getAndProcessBlock(params, addBlock)
//   // } else {
//   //   return params
//   // }

//   return block;
// }

const base64Arraybuffer = async (data) => {
  const base64url = await new Promise((r) => {
    const reader = new FileReader();
    reader.onload = () => r(reader.result);
    reader.readAsDataURL(new Blob([data]));
  });
  return base64url.split(",", 2)[1];
};

async function getSignatureAndHash(params, block) {
  console.log("block", block);

  let holdHash = block.hash;
  console.log(":::", holdHash);

  const encoder = new TextEncoder();
  const algorithmParameters = {
    name: "RSA-PSS",
    saltLength: 32, //the length of the salt
  };

  console.log("BLOCK.signature", block.signature);

  let blockToVerify = {
    prevHash: block.prevHash,
    height: block.height,
    version: block.version,
    data: block.data,
    timestamp: block.timestamp,
    scope: block.scope,
    by: block.by,
  };

  if (params.priv) {
    let privateKey = await getPrivKey(params);

    let signature0 = await window.crypto.subtle.sign(
      algorithmParameters,
      privateKey, //from generateKey or importKey above
      encoder.encode(JSON.stringify(blockToVerify, null, 2)) //ArrayBuffer of data you want to sign
    );

    block.signature = await base64Arraybuffer(
      new Uint8Array(signature0).buffer
    );

    console.log("⭕️⭕️⭕️⭕️⭕️ signature0", block.signature);
  }

  let publicKey = await getPubKey(params, block);

  let signature_verified = await window.crypto.subtle.verify(
    algorithmParameters,
    publicKey,
    base64ToArrayBuffer(block.signature),
    encoder.encode(JSON.stringify(blockToVerify, null, 2))
  );

  blockToVerify = {
    prevHash: block.prevHash,
    height: block.height,
    version: block.version,
    data: block.data,
    timestamp: block.timestamp,
    scope: block.scope,
    signature: block.signature,
    by: block.by,
  };

  // let originalBlock = Object.assign({}, block)
  // delete block["hash"]

  const encoderHash = new TextEncoder();
  const digest = await window.crypto.subtle.digest(
    "SHA-256",
    encoderHash.encode(JSON.stringify(blockToVerify))
  );
  const hexDigest = buf2hex(new Uint8Array(digest).buffer);
  // console.log(":::HAD:", block.hash);
  // console.log(":::GOT:", hexDigest);
  // block.hash_verified = hexDigest === block.hash;

  // console.log("SIGN VERIFIED:", signature_verified);
  // console.log("HASH VERIFIED:", hexDigest === block.hash);

  // block.hash = holdHash
  // console.log("verified", block.signature_verified, block.hash_verified)

  // block.prettyDate = new Date(block.timestamp / 1)
  //   .toISOString()
  //   .replace("T", " ");
  // block.prettyDateLong = block.date.toLocaleString() + ` (GMT${block.date.getTimezoneOffset()})`

  // block.body = addLineBreaks(block.data);

  // self.blocksPerHash[block.rootHash] = block
  // params.listOfBlocks.push(block)
  // let keys = addBlock(block)

  // if (block.rootPrevHash !== "" && !keys.includes(block.rootPrevHash)) {
  //   params.hash = block.rootPrevHash
  //   return getAndProcessBlock(params, addBlock)
  // } else {
  //   return params
  // }

  // console.log({
  //   signature: signature_verified,
  //   hash: hexDigest === block.hash,
  //   correctHash: hexDigest,
  //   correctSignature: block.signature,
  // })

  return {
    signature: signature_verified,
    hash: hexDigest === block.hash,
    correctHash: hexDigest,
    correctSignature: block.signature,
  };
}
