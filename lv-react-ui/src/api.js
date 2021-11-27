function setConfigDhcp(config, cb) {
    fetch("/net/setup/eth0", {
        method: "post",
        body: JSON.stringify(config),
        headers: { "Content-Type": "application/json" }
      })
      .then(res => res.json())
      .then(json => cb(json))
      .catch(err => cb(err))
}

function setConfigStatic(config, cb){
    fetch("/net/setup/eth0", {
        method: "post",
        body: JSON.stringify(config),
        headers: { "Content-Type": "application/json" }
      })
      .then(res => res.json())
      .then(json => cb(json))
      .catch(err => cb(err))
}

function getConfig(cb) {
    fetch("/net/state/eth0")
      .then(res => res.json())
      .then(json => cb(json))
      .catch(err => cb(err))
}

function getPing(cb) {
    fetch("/ping")
      .then(res => res.json())
      .then(json => cb(json))
      .catch(err => cb(err))
}

const exports = {
    setConfigDhcp,
    getConfig,
    getPing, 
    setConfigStatic,
}

export default exports
