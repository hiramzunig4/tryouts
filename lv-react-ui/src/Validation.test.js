import Validation from './Validation'

test('net config has invalid method', () => {
    let input = { method: "other" }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(1)
    expect(result.errors.method).toBe("invalid method")
})

test('net config is dhcp', () => {
    let input = { method: "dhcp" }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(0)
})

test('net config is valid static', () => {
    let input = {
        method: "static",
        address: "10.77.0.10",
        prefix_length: 24,
        gateway: "10.77.0.1",
        name_servers: ["4.4.4.4", "8.8.8.8"]
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(0)
})

test('net config static address required', () => {
    let input = {
        method: "static",
        address: "",
        prefix_length: 24,
        gateway: "10.77.0.1",
        name_servers: ["4.4.4.4", "8.8.8.8"]
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(1)
    expect(result.errors.address).toBe("IP cannot be empty")
})


test('net config static invalid ip address', () => {
    let input = {
        method: "static",
        address: "10.0.77.",
        prefix_length: 24,
        gateway: "10.77.0.1",
        name_servers: []
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(1)
    expect(result.errors.address).toBe("IP has invalid format")
})


test('net config static invalid netmask is a string', () => {
    let input = {
        method: "static",
        address: "10.77.0.10",
        prefix_length: "8",
        gateway: "10.77.0.1",
        name_servers: []
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(1)
    expect(result.errors.prefix_length).toBe("Prefix length should be a number")
})

test('net config static invalid netmask not a correct number', () => {
    let input = {
        method: "static",
        address: "10.77.0.10",
        prefix_length: 64,
        gateway: "10.77.0.1",
        name_servers: []
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(1)
    expect(result.errors.prefix_length).toBe("Invalida prefix length")
})

test('net config gateway required', () => {
    let input = {
        method: "static",
        address: "10.77.0.10",
        prefix_length: 24,
        gateway: "",
        name_servers: []
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(1)
    expect(result.errors.gateway).toBe("IP cannot be empty")
})

test('net config static invalid gateway', () => {
    let input = {
        method: "static",
        address: "10.0.77.10",
        prefix_length: 24,
        gateway: "107.0.1",
        name_servers: []
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(1)
    expect(result.errors.gateway).toBe("IP has invalid format")
})

test('net config static invalid primary server name', () => {
    let input = {
        method: "static",
        address: "10.77.0.10",
        prefix_length: 24,
        gateway: "10.77.0.1",
        name_servers: ["10.77.0"]
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(1)
    expect(result.errors.dnsprimary).toBe("IP has invalid format")
})

test('net config static invalid secondary server name', () => {
    let input = {
        method: "static",
        address: "10.77.0.10",
        prefix_length: 24,
        gateway: "10.77.0.1",
        name_servers: ["10.77.0.1", "10.5."]
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(1)
    expect(result.errors.dnssecondary).toBe("IP has invalid format")
})

test('net config static dns primary empty, secondary correct', () => {
    let input = {
        method: "static",
        address: "10.77.0.10",
        prefix_length: 24,
        gateway: "10.77.0.1",
        name_servers: ["", "10.5.67.2"]
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(1)
    expect(result.errors.dnsprimary).toBe("IP cannot be empty")
})

test('net config static only dns primary valid', () => {
    let input = {
        method: "static",
        address: "10.77.0.10",
        prefix_length: 24,
        gateway: "10.77.0.1",
        name_servers: ["4.4.4.4"]
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(0)
})

test('net config static dns primary and secondary valids', () => {
    let input = {
        method: "static",
        address: "10.77.0.10",
        prefix_length: 24,
        gateway: "10.77.0.1",
        name_servers: ["4.4.4.4", "8.8.8.8"]
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(0)
})

test('net config static invalid gateway ip/24', () => {
    let input = {
        method: "static",
        address: "10.77.0.10",
        prefix_length: 24,
        gateway: "10.77.1.1",
        name_servers: ["4.4.4.4", "8.8.8.8"]
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(1)
    expect(result.errors.gateway).toBe("Invalid gateway segment")
})

test('net config static invalid gateway ip/16', () => {
    let input = {
        method: "static",
        address: "10.77.0.10",
        prefix_length: 16,
        gateway: "10.87.0.10",
        name_servers: ["4.4.4.4", "8.8.8.8"]
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(1)
    expect(result.errors.gateway).toBe("Invalid gateway segment")
})

test('net config static invalid gateway ip/8', () => {
    let input = {
        method: "static",
        address: "10.77.0.10",
        prefix_length: 8,
        gateway: "11.77.0.10",
        name_servers: ["4.4.4.4", "8.8.8.8"]
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(1)
    expect(result.errors.gateway).toBe("Invalid gateway segment")
})

test('net config static valid gateway ip/24', () => {
    let input = {
        method: "static",
        address: "10.77.0.10",
        prefix_length: 24,
        gateway: "10.77.0.1",
        name_servers: ["4.4.4.4", "8.8.8.8"]
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(0)
})

test('net config static valid gateway ip/16', () => {
    let input = {
        method: "static",
        address: "10.77.0.10",
        prefix_length: 16,
        gateway: "10.77.0.1",
        name_servers: ["4.4.4.4", "8.8.8.8"]
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(0)
})

test('net config static valid gateway ip/8', () => {
    let input = {
        method: "static",
        address: "10.77.0.10",
        prefix_length: 8,
        gateway: "10.77.0.1",
        name_servers: ["4.4.4.4", "8.8.8.8"]
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(0)
})