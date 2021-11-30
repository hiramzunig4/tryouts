import { Netmask } from 'netmask' //https://stackoverflow.com/questions/503052/javascript-is-ip-in-one-of-these-subnets

const addToError = function (result, name, message) {
    result.errors[name] = message
    result.count++
}

const checkIpStructure = function (result, ip, name) {
    ip = ip || ""
    if (ip.trim().length === 0) {
        addToError(result, name, "IP cannot be empty")
        return
    }
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip) === false) {
        addToError(result, name, "IP has invalid format")
        return
    }
}

const checkPrefixLength = function (result, prefixLength, name) {
    if (!Number.isInteger(prefixLength)) {
        addToError(result, name, "Prefix length should be a number")
        return
    }
    if ([8, 16, 24].indexOf(prefixLength) < 0) {
        addToError(result, name, "Invalida prefix length")
        return
    }
}

const checkNameServersLength = function (result, length, name) {
    if ([0, 1, 2].indexOf(length) < 0) {
        addToError(result, name, "Invalid name servers length")
        return
    }
}

const checkGatewayIsinNetmask = function (result, gateway, ipNetmask, name) {
    const block = new Netmask(ipNetmask)
    const ip = gateway
    if (!block.contains(ip)) {
        addToError(result, name, "Invalid gateway segment")
        return
    }
}

const validateNetConfig = function (input) {
    const result = { count: 0, errors: {}, input }
    switch (input.method) {
        case "dhcp":
            break
        case "static":
            checkIpStructure(result, input.address, "address")
            checkPrefixLength(result, input.prefix_length, "prefix_length")
            checkIpStructure(result, input.gateway, "gateway")
            if (!result.count > 0) {
                checkGatewayIsinNetmask(result, input.gateway, `${input.address}/${input.prefix_length}`, "gateway")
            }
            checkNameServersLength(result, input.name_servers.length, "nameservers_length")
            if (input.name_servers.length > 0) {
                checkIpStructure(result, input.name_servers[0], "dnsprimary")
            }
            if (input.name_servers.length > 1) {
                checkIpStructure(result, input.name_servers[1], "dnssecondary")
            }
            break
        default:
            addToError(result, "method", "invalid method")
            break
    }
    return result
}

const exports = {
    validateNetConfig,
}

export default exports