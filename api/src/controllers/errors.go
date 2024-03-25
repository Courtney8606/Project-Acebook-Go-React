package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func SendInternalError(ctx *gin.Context, err error) {
	if gin.Mode() == "release" {
		ctx.JSON(http.StatusInternalServerError, gin.H{"err": "Something went wrong"})
	} else {
		ctx.JSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
	}
}
