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
	posts.GET("/:id/like", middleware.AuthenticationMiddleware, controllers.GetLikeCount)
	posts.POST("/:id/like", middleware.AuthenticationMiddleware, controllers.UserLikePost)
	posts.POST("/:id/delete", middleware.AuthenticationMiddleware, controllers.DeletePost)
}
