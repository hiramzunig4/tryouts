package main

import (
	"embed"
	"encoding/json"
	"log"
	"mime"
	"net"
	"net/http"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode) //remove debug warning
	router := gin.New()          //remove default logger
	router.Use(gin.Recovery())   //catches panics
	router.Use(static)
	router.GET("/discovery/:tos", func(c *gin.Context) {
		toss := c.Param("tos")
		tos, err := strconv.ParseInt(toss, 10, 32)
		if err != nil {
			c.String(http.StatusBadRequest, err.Error())
			return
		}
		if tos <= 0 || tos >= 5 {
			c.String(http.StatusBadRequest, "invalid tos (0, 5)")
			return
		}
		list, err := discover(int(tos))
		if err != nil {
			c.String(http.StatusBadRequest, err.Error())
			return
		}
		c.JSON(http.StatusOK, list)
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

type IdRequestDso struct {
	Name   string `json:"name"`
	Action string `json:"action"`
}

type IdResponseDso struct {
	Name   string         `json:"name"`
	Action string         `json:"action"`
	Data   IdResponseData `json:"data"`
}

type IdResponseData struct {
	Hostname string `json:"hostname"`
	Ifname   string `json:"ifname"`
	MacAddr  string `json:"macaddr"`
	Name     string `json:"name"`
	Version  string `json:"version"`
}

func discover(tos int) ([]*IdResponseDso, error) {
	socket, err := net.ListenUDP("udp4", &net.UDPAddr{})
	if err != nil {
		return nil, err
	}
	defer socket.Close()
	log.Println("LocalAddr", socket.LocalAddr())
	idb, err := json.Marshal(&IdRequestDso{
		Name: "nerves", Action: "id"})
	if err != nil {
		return nil, err
	}
	log.Println(">", string(idb))
	idn, err := socket.WriteToUDP(idb, &net.UDPAddr{
		IP:   net.IPv4(255, 255, 255, 255),
		Port: 31680,
	})
	if err != nil || idn != len(idb) {
		return nil, err
	}
	list := []*IdResponseDso{}
	inbuf := make([]byte, 2048)
	tosd := time.Duration(tos)
	socket.SetDeadline(time.Now().Add(tosd * time.Second))
	for {
		inn, _, err := socket.ReadFromUDP(inbuf)
		nerr, ok := err.(net.Error)
		if ok && nerr.Timeout() {
			return list, nil
		}
		if err != nil {
			return nil, err
		}
		log.Println("<", string(inbuf[:inn]))
		response := &IdResponseDso{}
		err = json.Unmarshal(inbuf[:inn], response)
		if err != nil {
			log.Println(err)
		} else {
			log.Println(response)
			list = append(list, response)
		}
	}
}
