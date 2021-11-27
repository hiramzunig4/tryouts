import Validation from './Validation';

test('net config has valid type', () => {
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
    let input = {type: "static"}
    let output = Validation.validateNetConfig(input)
    expect(output.type).toBe("errors");
    expect(output.address).toBe("IP cannot be empty");
});
