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

test('net correct is valid static config', () => {
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

test('net config static address required', () => {
    let input = {
        method: "static",
        address: "",
        prefix_length: 8,
        gateway: "10.77.0.1",
        name_servers: []
    }
    let result = Validation.validateNetConfig(input)
    expect(result.count).toBe(1)
    expect(result.errors.address).toBe("IP cannot be empty")
})
