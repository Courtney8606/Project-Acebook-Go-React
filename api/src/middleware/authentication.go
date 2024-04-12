package middleware

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/auth"
)

func AuthenticationMiddleware(ctx *gin.Context) {
	authHeader := ctx.GetHeader("Authorization")
	if len(authHeader) < 7 {
		fmt.Println("Authorization header is missing or invalid")
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "Authorization header is missing or invalid"})
		return
	}

	tokenString := authHeader[7:]

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
