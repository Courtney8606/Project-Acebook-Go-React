package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/controllers"
)

func setupAuthenticationRoutes(baseRouter *gin.RouterGroup) {
	tokensRouter := baseRouter.Group("/tokens")

	tokensRouter.POST("", controllers.CreateToken)
}
