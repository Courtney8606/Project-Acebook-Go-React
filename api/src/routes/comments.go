package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/controllers"
	"github.com/makersacademy/go-react-acebook-template/api/src/middleware"
)

func setupCommentRoutes(baseRouter *gin.RouterGroup) {
	posts := baseRouter.Group("/comments")

	posts.POST("/:id", middleware.AuthenticationMiddleware, controllers.CreateComment)
	posts.GET("/:id", middleware.AuthenticationMiddleware, controllers.GetCommentsByPostID)
}
