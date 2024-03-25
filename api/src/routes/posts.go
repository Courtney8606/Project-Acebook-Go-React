package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/controllers"
	"github.com/makersacademy/go-react-acebook-template/api/src/middleware"
)

func setupPostRoutes(baseRouter *gin.RouterGroup) {
	posts := baseRouter.Group("/posts")

	posts.POST("", middleware.AuthenticationMiddleware, controllers.CreatePost)
	posts.GET("", middleware.AuthenticationMiddleware, controllers.GetAllPosts)
}
