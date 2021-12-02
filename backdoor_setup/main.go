package main

import (
	"embed"
	"encoding/json"
	"log"
	"mime"
	"net"
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

type IdDso struct {
	Name   string `json:"name"`
	Action string `json:"action"`
}

func main1() {
	ra, err := net.ResolveUDPAddr("udp4", "255.255.255.255:31680")
	if err != nil {
		log.Fatal(err)
	}
	conn, err := net.DialUDP("udp4", nil, ra)
	if err != nil {
		log.Fatal(err)
	}
	id := &IdDso{Name: "nerves", Action: "id"}
	idb, err := json.Marshal(id)
	if err != nil {
		log.Fatal(err)
	}
	log.Println(">", string(idb))
	idn, err := conn.Write(idb)
	if err != nil || idn != len(idb) {
		log.Fatal(err)
	}
	input := make([]byte, 2048)
	inn, err := conn.Read(input)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("<", string(input[:inn]))
}

func main() {
	gin.SetMode(gin.ReleaseMode) //remove debug warning
	router := gin.New()          //remove default logger
	router.Use(gin.Recovery())   //catches panics
	router.Use(static)
	router.GET("/discovery", func(c *gin.Context) {
		c.JSON(http.StatusOK, "OK")
	})
	//FIXME
	listen, err := net.Listen("tcp", ":5000")
	if err != nil {
		log.Fatal(err)
	}
	server := &http.Server{
		Addr:    ":5000",
		Handler: router,
	}
	err = server.Serve(listen)
	if err != nil {
		log.Println(err)
	}
}

//go:embed build/*
var build embed.FS

func static(c *gin.Context) {
	path := "build" + c.Request.URL.Path
	if path == "build/" {
		path = "build/index.html"
	}
	data, err := build.ReadFile(path)
	if err != nil {
		c.Next()
	} else {
		ext := filepath.Ext(path)
		ct := mime.TypeByExtension(ext)
		c.Data(http.StatusOK, ct, data)
	}
}
