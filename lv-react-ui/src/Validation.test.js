import Validation from './Validation';

test('net config has invalid type', () => {
    let input = {type: "other"}
    let output = Validation.validateNetConfig(input)
    expect(output.type).toBe("errors");
    expect(output.input).toBe("Invalid config type other");
});

test('net config dhcp', () => {
    let input = {type: "dhcp"}
    let output = Validation.validateNetConfig(input)
    expect(output.type).toBe("output");
    expect(output.config.method).toBe("dhcp");
});

test('net config static address required', () => {
     let input = {
        type: "static",
        address:"", 
        prefix_length:8, 
        gateway:  "10.77.0.1", 
        name_servers:[]
    }
    let output = Validation.validateNetConfig(input)
    expect(output.type).toBe("errors");
    expect(output.address).toBe("IP cannot be empty");
});

test('net config static address correct', () => {
    let input = {
        type: "static",
        address:"10.77.0.10", 
        prefix_length:8, 
        gateway:  "10.77.0.1", 
        name_servers:[]
    }
    let output = Validation.validateNetConfig(input)
    expect(output.type).toBe("output");
});