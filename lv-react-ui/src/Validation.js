import { Netmask } from 'netmask' //https://stackoverflow.com/questions/503052/javascript-is-ip-in-one-of-these-subnets
import ValidationIp from './ValidationIp'

const addToError = function (result, name, message) {
    result.errors[name] = message
    result.count++
}

const validateIpStructure = function (result, ip, name) {
    ip = ip || ""
    let error = ValidationIp.validateIp(ip)
    if (error) {
        addToError(result, name, error)
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
            validateIpStructure(result, input.address, "address")
            checkPrefixLength(result, input.prefix_length, "prefix_length")
            validateIpStructure(result, input.gateway, "gateway")
            if (result.count === 0) {
                checkGatewayIsinNetmask(result, input.gateway, `${input.address}/${input.prefix_length}`, "gateway")
            }
            checkNameServersLength(result, input.name_servers.length, "nameservers_length")
            if (input.name_servers.length > 0) {
                validateIpStructure(result, input.name_servers[0], "dnsprimary")
            }
            if (input.name_servers.length > 1) {
                validateIpStructure(result, input.name_servers[1], "dnssecondary")
            }
            break
        default:
            addToError(result, "method", "invalid method")
            break
    }
    return result
}

const exports = {
    validateIpStructure,
    validateNetConfig,
}

export default exports