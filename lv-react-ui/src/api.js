function setNetworkConfigDhcp(config, cb) {
  fetch("/net/setup/eth0", {
    method: "post",
    body: JSON.stringify(config),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(json => cb(json))
    .catch(err => cb(err))
}

function setNetworkConfigStatic(config, cb) {
  fetch("/net/setup/eth0", {
    method: "post",
    body: JSON.stringify(config),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(json => cb(json))
    .catch(err => cb(err))
}

function getNetworkConfig(cb) {
  fetch("/net/state/eth0")
    .then(res => res.json())
    .then(json => cb(json))
    .catch(err => cb(err))
}

function getNetworkPing(cb) {
  fetch("http://10.77.3.170:31680/ping")
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
}

export default exports