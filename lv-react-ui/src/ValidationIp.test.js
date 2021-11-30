import ValidationIp from './ValidationIp'

test('ip with non-numbers is rejected', () => {
    expect(ValidationIp.validateIp("1.2.3.a")).toBe("IP has invalid format")
    expect(ValidationIp.validateIp("1.2.a.4")).toBe("IP has invalid format")
    expect(ValidationIp.validateIp("1.a.3.4")).toBe("IP has invalid format")
    expect(ValidationIp.validateIp("a.2.3.a")).toBe("IP has invalid format")
})

test('ip with whitespaces and non printables is considered empty', () => {
    const ip = " \r \t \n "
    expect(ValidationIp.validateIp(ip)).toBe("IP cannot be empty")
})

test('ip with only 3 fields with dot is rejected', () => {
    const ip = "11.2.3."
    expect(ValidationIp.validateIp(ip)).toBe("IP has invalid format")
})

test('ip with only 3 fields is rejected', () => {
    const ip = "11.2.3"
    expect(ValidationIp.validateIp(ip)).toBe("IP has invalid format")
})

test('ip with out of range numbers is rejected', () => {
    expect(ValidationIp.validateIp("1.2.3.256")).toBe("IP has invalid format")
    expect(ValidationIp.validateIp("1.2.256.3")).toBe("IP has invalid format")
    expect(ValidationIp.validateIp("1.256.2.3")).toBe("IP has invalid format")
    expect(ValidationIp.validateIp("256.1.2.3")).toBe("IP has invalid format")
    expect(ValidationIp.validateIp("1.2.3.-1")).toBe("IP has invalid format")
    expect(ValidationIp.validateIp("1.2.-1.3")).toBe("IP has invalid format")
    expect(ValidationIp.validateIp("1.-1.2.3")).toBe("IP has invalid format")
    expect(ValidationIp.validateIp("-1.1.2.3")).toBe("IP has invalid format")
})

test('ip with only zeros is rejected', () => {
    const ip = "0.0.0.0"
    expect(ValidationIp.validateIp(ip)).toBe("IP has invalid format")
})
