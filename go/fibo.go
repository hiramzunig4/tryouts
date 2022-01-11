package main

import "fmt"

func fibonacci() func(int, int, int) int {
	return func(n int, a int, b int) int {
		if n == 0 {
			return n
		}
		if n == 1 {
			return n
		}
		var c = a + b
		return c
	}
}

func main() {
	f := fibonacci()
	var a = 0
	var b = 0
	for i := 0; i < 21; i++ {
		var c = f(i, a, b)
		fmt.Println(c)
		a = b
		b = c
	}
}
