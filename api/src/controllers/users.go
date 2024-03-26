package controllers

import (
	"net/http"

	emailverifier "github.com/AfterShip/email-verifier"
	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/models"
)

var (
	verifier = emailverifier.NewVerifier()
)

func CreateUser(ctx *gin.Context) {
	var newUser models.User
	err := ctx.BindJSON(&newUser)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if newUser.Email == "" || newUser.Password == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Must supply username and password"})
		return
	} else {
		email := newUser.Email
		verify, _ := verifier.Verify(email)
		if !verify.Syntax.Valid {
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Invalid email address"})
			return
		} else {
			existingUser, _ := models.FindUserByEmail(newUser.Email)
			if existingUser.Email != "" {
				ctx.JSON(http.StatusBadRequest, gin.H{"message": "Email address already in use"})
				return
			}
		}
		_, err = newUser.Save()
		if err != nil {
			SendInternalError(ctx, err)
			return
		}

		ctx.JSON(http.StatusCreated, gin.H{"message": "OK"})
	}
}
