
const validateIp = function (ip) {
    ip = ip || ""
    if (ip.trim().length === 0) {
        return "IP cannot be empty"
    }
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip) === false) {
        return "IP has invalid format"
    }
}

const exports = {
    validateIp,
}

export default exports