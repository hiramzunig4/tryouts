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

function setNetworkConfigStatic(config, cb){
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
    fetch("/ping")
      .then(res => res.json())
      .then(json => cb(json))
      .catch(err => cb(err))
}

const exports = {
    setNetworkConfigDhcp,
    getNetworkConfig,
    getNetworkPing, 
    setNetworkConfigStatic,
}

export default exports