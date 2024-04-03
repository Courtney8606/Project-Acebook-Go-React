package middleware

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/auth"
)

func AuthenticationMiddleware(ctx *gin.Context) {
	tokenString := ctx.GetHeader("Authorization")[7:]

	// fmt.Println(tokenString)

	token, err := auth.DecodeToken(tokenString)

	if err != nil {
		fmt.Println(err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "auth error"})
		return
	}

	ctx.Set("userID", token.UserID)
	ctx.Next()
}
