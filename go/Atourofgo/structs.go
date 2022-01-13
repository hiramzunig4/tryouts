package main

import "fmt"

type Vertex struct {
	X int
	Y int
	Z string
}

var (
	v1 = Vertex{X: 1, Y: 2}
	v2 = Vertex{X: 4}
	v3 = Vertex{}
	p  = &Vertex{1, 2, "Is a Pointer"}
)

//is a collection of fields
func structs() {
	v := Vertex{1, 2, "Hola"} //se declara una estructura
	fmt.Println(v)            // se imprime
	v.X = 4                   //se cambia
	fmt.Println(v.X, v.Y, v.Z)
	p := &v
	p.X = 1e9
	fmt.Println(p)
	v.X = 5 //se cambia
	fmt.Println(v.X, v.Y, v.Z)
	fmt.Println(p)
	//porque puedo cambiar con el puntero y de manera
	//directa el valor de un campo de la estructura?
	fmt.Println(v1, p, v2, v3)
}
