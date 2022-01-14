package main

import "fmt"

func slices() {
	primes := [6]int{2, 3, 5, 7, 11, 13}

	var s []int = primes[1:4] //slices without size
	fmt.Println(s)

	names := [4]string{
		"John",
		"Paul",
		"George",
		"Ringo",
	}
	fmt.Println(names)

	a := names[0:2]
	b := names[1:3]
	fmt.Println(a, b)
	fmt.Println(b[0], b[1])
	b[0] = "XXX"
	fmt.Println(a, b)
	fmt.Println(names)

}
