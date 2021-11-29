
const addToErrors = function(errors, name, message) {
    errors[name] = message
    errors.count ++
}

const checkIpAddress = function(ip, errors, name) {
    ip = ip || ""
    if (ip.trim().length == 0) {
        addToErrors(errors, name, "IP cannot be empty")
        return
    }
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip) == false) {  
        addToErrors(errors, name, "Enter a correct ip structure")
        return
    } 
}

const validateNetConfig = function(input) {
    const errors = {type: "errors", count: 0}
    const output = {type: "output"}
    switch (input.type) {
        case "dhcp":
        output.config = {"method":"dhcp"}
        return errors.count > 0 ? errors : output
        case "static":
            checkIpAddress(input.address, errors, "address")
        return errors.count > 0 ? errors : output
        default:
            errors.input = `Invalid config type ${input.type}`
            return errors
        }
}

const exports = {
    validateNetConfig,
}

export default exports