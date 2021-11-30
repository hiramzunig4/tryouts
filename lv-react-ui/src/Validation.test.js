import Validation from './Validation'

test('net config has invalid type', () => {
    let input = {type: "other"}
    let output = Validation.validateNetConfig(input)
    expect(output.type).toBe("errors")
    expect(output.input).toBe("Invalid config type other")
})

test('net config dhcp', () => {
    let input = {type: "dhcp"}
    let output = Validation.validateNetConfig(input)
    expect(output.type).toBe("output")
    expect(output.config.method).toBe("dhcp")
})

test('net correct static config', () => {
    let input = {
        type: "static",
        address:"10.77.0.10", 
        prefix_length:8, 
        gateway:  "10.77.0.1", 
        name_servers:["4.4.4.4","8.8.8.8"]
    }
    let output = Validation.validateNetConfig(input)
    expect(output.type).toBe("output")
})
    
test('net config static address required', () => {
    let input = {
       type: "static",
       address:"", 
       prefix_length:8, 
       gateway:  "10.77.0.1", 
       name_servers:[]
   }
   let output = Validation.validateNetConfig(input)
   expect(output.type).toBe("errors")
   expect(output.address).toBe("IP cannot be empty")
})

test('net config static invalid ip address', () =>{
    let input = {
        type: "static",
        address:"10.0.77.", 
        prefix_length:8, 
        gateway:  "10.77.0.1", 
        name_servers:[]
    }
    let output = Validation.validateNetConfig(input)
    expect(output.type).toBe("errors")
    expect(output.address).toBe("Enter a correct IP structure")
})

test('net config netmask required as a number', () => {
    let input = {
       type: "static",
       address:"10.77.0.10", 
       prefix_length:"8", 
       gateway:  "10.77.0.1", 
       name_servers:[]
   }
   let output = Validation.validateNetConfig(input)
   expect(output.type).toBe("errors")
   expect(output.prefix_length).toBe("Prefix length should be a number")
})

test('net config gateway required', () => {
    let input = {
       type: "static",
       address:"10.77.0.10", 
       prefix_length:8, 
       gateway:  "", 
       name_servers:[]
   }
   let output = Validation.validateNetConfig(input)
   expect(output.type).toBe("errors")
   expect(output.gateway).toBe("IP cannot be empty")
})

test('net config static invalid gateway', () =>{
    let input = {
        type: "static",
        address:"10.0.77.10", 
        prefix_length:8, 
        gateway:  "107.0.1", 
        name_servers:[]
    }
    let output = Validation.validateNetConfig(input)
    expect(output.type).toBe("errors")
    expect(output.gateway).toBe("Enter a correct IP structure")
})

test('net config static invalid primary server name', () =>{
    let input = {
        type: "static",
        address:"10.0.77.10", 
        prefix_length:8, 
        gateway:  "107.0.1", 
        name_servers:["10.77.0"]
    }
    let output = Validation.validateNetConfig(input)
    expect(output.type).toBe("errors")
    expect(output.gateway).toBe("Enter a correct IP structure")
})

test('net config static invalid secondary server name', () =>{
    let input = {
        type: "static",
        address:"10.0.77.10", 
        prefix_length:8, 
        gateway:  "107.0.1", 
        name_servers:["10.77.0.1", "10.5."]
    }
    let output = Validation.validateNetConfig(input)
    expect(output.type).toBe("errors")
    expect(output.gateway).toBe("Enter a correct IP structure")
})

test('net config static dns primary empty secondary correct', () =>{
    let input = {
        type: "static",
        address:"10.0.77.10", 
        prefix_length:8, 
        gateway:  "107.0.1", 
        name_servers:["", "10.5.67.2"]
    }
    let output = Validation.validateNetConfig(input)
    expect(output.type).toBe("errors")
    expect(output.gateway).toBe("Enter a correct IP structure")
})

test('net config static without name servers', () =>{
    let input = {
        type: "static",
        address:"10.0.77.10", 
        prefix_length:8, 
        gateway:  "10.0.1.1", 
        name_servers:[]
    }
    let output = Validation.validateNetConfig(input)
    expect(output.type).toBe("output")
})

test('net config static dns primary valid', () =>{
    let input = {
        type: "static",
        address:"10.0.77.10", 
        prefix_length:8, 
        gateway:  "10.0.1.1", 
        name_servers:["4.4.4.4"]
    }
    let output = Validation.validateNetConfig(input)
    expect(output.type).toBe("output")
})

test('net config static dns primary and secondary valids', () =>{
    let input = {
        type: "static",
        address:"10.0.77.10", 
        prefix_length:8, 
        gateway:  "10.0.1.1", 
        name_servers:["4.4.4.4", "8.8.8.8"]
    }
    let output = Validation.validateNetConfig(input)
    expect(output.type).toBe("output")
})