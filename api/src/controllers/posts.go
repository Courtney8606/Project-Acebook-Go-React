package controllers

import (
	"fmt"
	"net/http"

	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/auth"
	"github.com/makersacademy/go-react-acebook-template/api/src/models"
)

type JSONPost struct {
	ID      uint   `json:"_id"`
	Message string `json:"message"`
	Likes   []int  `json:"liked_user_ids"`
}

func GetAllPosts(ctx *gin.Context) {
	posts, err := models.FetchAllPosts()

	if err != nil {
		SendInternalError(ctx, err)
		return
	}

	val, _ := ctx.Get("userID")
	userID := val.(string)
	var userIDUint uint64
	userIDUint, err = strconv.ParseUint(userID, 10, 64)
	if err != nil {
		SendInternalError(ctx, err)
		return
	}

	token, _ := auth.GenerateToken(uint(userIDUint))

	// Convert posts to JSON Structs
	jsonPosts := make([]JSONPost, 0)
	for _, post := range *posts {
		jsonPosts = append(jsonPosts, JSONPost{
			Message: post.Message,
			ID:      post.ID,
			Likes:   post.Likes,
		})
	}

	ctx.JSON(http.StatusOK, gin.H{"posts": jsonPosts, "token": token})
}

type createPostRequestBody struct {
	Message string
}

func CreatePost(ctx *gin.Context) {
	var requestBody createPostRequestBody
	err := ctx.BindJSON(&requestBody)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err})
		return
	}

	if len(requestBody.Message) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Post message empty"})
		return
	} else if len(requestBody.Message) > 280 {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Post message too long (must be less than or equal to 280 chars)"})
		return
	}

	newPost := models.Post{
		Message: requestBody.Message,
	}

	_, err = newPost.Save()
	if err != nil {
		SendInternalError(ctx, err)
		return
	}

	val, _ := ctx.Get("userID")
	userID := val.(string)
	var userIDUint uint64
	userIDUint, err = strconv.ParseUint(userID, 10, 64)
	if err != nil {
		SendInternalError(ctx, err)
		return
	}
	token, _ := auth.GenerateToken(uint(userIDUint))

	ctx.JSON(http.StatusCreated, gin.H{"message": "Post created", "token": token})
}

//GET route for /posts/:id/like
// Retrieves the number of likes for the post

func GetLikeCount(ctx *gin.Context) {
	postID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		SendInternalError(ctx, err)
		return
	}

	post, err := models.FetchPostById(postID)
	if err != nil {
		SendInternalError(ctx, err)
		return
	}

	val, _ := ctx.Get("userID")
	userID, err := strconv.Atoi(val.(string))
	if err != nil {
		SendInternalError(ctx, err)
		return
	}
	// jsonPosts := make([]JSONPost, 0)
	// jsonPosts = append(jsonPosts, JSONPost{
	// 	Message: post.Message,
	// 	ID:      post.ID,
	// 	Likes:   post.Likes,
	// })
	userHasLiked := models.HasUserLikedPost(*post, userID)
	likecount := len(post.Likes)
	ctx.JSON(http.StatusOK, gin.H{"LikeCount": likecount, "UserHasLiked": userHasLiked, "postID": postID})
}

//POST route for /posts/:id/like
// Uses the model LikePost function to like the post for the user

func UserLikePost(ctx *gin.Context) {
	postID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		SendInternalError(ctx, err)
		return
	}

	val, _ := ctx.Get("userID")
	userID, err := strconv.Atoi(val.(string))
	if err != nil {
		SendInternalError(ctx, err)
		return
	}
	_, err = models.FetchPostById(postID)
	if err != nil {
		SendInternalError(ctx, err)
		return
	}

	err = models.LikePost(postID, userID)
	if err == fmt.Errorf("user has liked post already") {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "User has already liked this post"})
		return
	}
	if err != nil {
		SendInternalError(ctx, err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "post liked successfully", "userID": userID})

}

func UserUnlikePost(ctx *gin.Context) {
	postID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		SendInternalError(ctx, err)
		return
	}

	val, _ := ctx.Get("userID")
	userID, err := strconv.Atoi(val.(string))
	if err != nil {
		SendInternalError(ctx, err)
		return
	}
	_, err = models.FetchPostById(postID)
	if err != nil {
		SendInternalError(ctx, err)
		return
	}

	err = models.UnlikePost(postID, userID)
	if err == fmt.Errorf("user hasn't liked post") {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "User has already liked this post"})
		return
	}
	if err != nil {
		SendInternalError(ctx, err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "post unliked successfully", "userID": userID})
}
