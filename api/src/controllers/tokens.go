package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/auth"
	"github.com/makersacademy/go-react-acebook-template/api/src/models"
)

type CreateTokenRequestBody struct {
	Email    string
	Password string
}

func CreateToken(ctx *gin.Context) {
	var input CreateTokenRequestBody
	err := ctx.ShouldBindJSON(&input)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
	}

	fmt.Println(input)

	user, err := models.FindUserByEmail(input.Email)
	if err != nil {
		SendInternalError(ctx, err)
	}

	if user.Password != input.Password {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "Password incorrect"})
		return
	}

	token, err := auth.GenerateToken(user.ID)
	if err != nil {
		SendInternalError(ctx, err)
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{"token": token, "message": "OK"})
}
