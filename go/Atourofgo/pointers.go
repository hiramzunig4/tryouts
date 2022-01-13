package main

import "fmt"

func pointers() {
	i, j := 42, 2701

	var p *int //declaration of pointer
	p = &i     // point to i
	//p := &i //usar este si no declaro la variable previamente

	fmt.Println(*p) // read i through the pointer
	*p = 21         // set i through the pointer
	fmt.Println(i)  // see the new value of i

	p = &j         // point to j
	*p = *p / 37   // divide j through the pointer
	fmt.Println(j) // see the new value of j
}
