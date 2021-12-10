//Network
function setNetworkConfigDhcp(config, cb, ip, username, pass) {
  fetch(`http://${ip}:31680/net/setup/eth0`, {
    method: "post",
    body: JSON.stringify(config),
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Basic ' + Buffer.from(`${username}:${pass}`).toString('base64')
    }
  })
    .then(res => res.json())
    .then(json => cb(json))
    .catch(err => cb(err))
}

function setNetworkConfigStatic(config, cb, ip, username, pass) {
  fetch(`http://${ip}:31680/net/setup/eth0`, {
    method: "post",
    body: JSON.stringify(config),
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Basic ' + Buffer.from(`${username}:${pass}`).toString('base64')
    }
  })
    .then(res => res.json())
    .then(json => cb(json))
    .catch(err => cb(err))
}

function getNetworkConfig(cb, ip, username, pass) {
  console.log(`Esto llega ${ip} ${username} ${pass}`)
  fetch(`http://${ip}:31680/net/state/eth0`, {
    headers: { 'Authorization': 'Basic ' + Buffer.from(`${username}:${pass}`).toString('base64') }
  })
    .then(res => res.json())
    .then(json => cb(json))
    .catch(err => cb(err))
}

function getNetworkPing(cb, ip, username, pass) {
  fetch(`http://${ip}:31680/ping`, {
    headers: { 'Authorization': 'Basic ' + Buffer.from(`${username}:${pass}`).toString('base64') }
  })
    .then(res => res.json())
    .then(json => cb(json))
    .catch(err => cb(err))
}

function blinkNetworkDevice(cb, ip) {
  fetch(`blink/${ip}`)
    .then(res => res.json())
    .then(json => cb(json))
    .catch(err => cb(err))
}

//Discover
function getNetworkDiscover(cb) {
  fetch("discovery/2")
    .then(res => res.json())
    .then(json => cb(json))
    .catch(err => cb(err))
}

//Security
function setNewPass(cb, ip, username, pass, newPass) {
  console.log("Si entre a set new pass")
  fetch(`http://${ip}:31680/pass/set`, {
    method: "post",
    body: `${newPass}`,
    headers: { 'Authorization': 'Basic ' + Buffer.from(`${username}:${pass}`).toString('base64') }
  })
    .then(res => res.json())
    .then(json => cb(json))
    .catch(err => cb(err))
}

function setDisablePass(cb, ip, username, pass) {
  console.log("Si entre a set new pass")
  fetch(`http://${ip}:31680/pass/disable`, {
    headers: { 'Authorization': 'Basic ' + Buffer.from(`${username}:${pass}`).toString('base64') }
  })
    .then(res => res.json())
    .then(json => cb(json))
    .catch(err => cb(err))
}


function setResetPass(cb, ip, username, pass) {
  console.log("Si entre a set new pass")
  fetch(`http://${ip}:31680/pass/reset`, {
    headers: { 'Authorization': 'Basic ' + Buffer.from(`${username}:${pass}`).toString('base64') }
  })
    .then(res => res.json())
    .then(json => cb(json))
    .catch(err => cb(err))
}

const exports = {
  setNetworkConfigDhcp,
  getNetworkConfig,
  getNetworkPing,
  setNetworkConfigStatic,
  getNetworkDiscover,
  blinkNetworkDevice,
  setNewPass,
  setDisablePass,
  setResetPass,
}

export default exports