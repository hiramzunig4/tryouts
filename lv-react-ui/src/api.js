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

function getNetworkDiscover(cb) {
  fetch("discovery/2")
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
}

export default exports