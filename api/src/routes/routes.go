package routes

import "github.com/gin-gonic/gin"

func SetupRoutes(engine *gin.Engine) {
	apiRouter := engine.Group("/")
	setupUserRoutes(apiRouter)
	setupPostRoutes(apiRouter)
	setupCommentRoutes(apiRouter)
	setupAuthenticationRoutes(apiRouter)
	setupImageRoutes(apiRouter)
}
