const addToErrors = function(errors, name, message) {
    errors[name] = message
    errors.count ++
}

const checkIpStructure = function(ip, errors, name) {
    ip = ip || ""
    if (ip.trim().length == 0) {
        addToErrors(errors, name, "IP cannot be empty")
        return
    }
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip) === false) {  
        addToErrors(errors, name, "Enter a correct IP structure")
        return
    } 
}

const checkPrefixLengthisNumber = function(prefixLength, errors, name) {
    if (!Number.isInteger(prefixLength)) {
        addToErrors(errors, name, "Prefix length should be a number")
        return
    }
}

const validateNetConfig = function(input) {
    const errors = {type: "errors", count: 0}
    const output = {type: "output"}
    const servers = []
    switch (input.type) {
        case "dhcp":
            output.config = {"method":"dhcp"}
        return errors.count > 0 ? errors : output
        case "static":
            checkIpStructure(input.address, errors, "address")
            checkPrefixLengthisNumber(input.prefix_length, errors, "prefix_length")
            checkIpStructure(input.gateway, errors, "gateway")
            if(input.name_servers.length > 0){
                checkIpStructure(input.name_servers[0], errors, "dnsprimary")
                servers.push(input.name_servers[0])
            }
            if(input.name_servers.length > 1){
                checkIpStructure(input.name_servers[1], errors, "dnssecondary")
                servers.push(input.name_servers[1])
            }
            output.config = {
                method: input.type,
                address:input.address, 
                prefix_length:input.prefix_length, 
                gateway:  input.gateway, 
                name_servers:servers
            }
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