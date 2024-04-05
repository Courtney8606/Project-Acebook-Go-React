package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/controllers"
	"github.com/makersacademy/go-react-acebook-template/api/src/middleware"
)

func setupImageRoutes(baseRouter *gin.RouterGroup) {
	images := baseRouter.Group("/images")

	images.POST("/upload", middleware.AuthenticationMiddleware, controllers.UploadProfilePicture)

	images.GET("/:id", middleware.AuthenticationMiddleware, controllers.GetProfilePicForUser)
}
