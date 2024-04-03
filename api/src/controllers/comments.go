package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/models"
)

type createCommentRequestBody struct {
	Text string
}

type JSONComment struct {
	ID       uint   `json:"comment_id"`
	Text     string `json:"text"`
	Username string `json:"username"`
}

func CreateComment(ctx *gin.Context) {
	var requestBody createCommentRequestBody
	err := ctx.BindJSON(&requestBody)
	// fmt.(&requestBody)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err})
		return
	}

	if len(requestBody.Text) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Comment message empty"})
		return
	} else if len(requestBody.Text) > 280 {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Comment message too long (must be less than or equal to 280 chars)"})
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

	postID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		SendInternalError(ctx, err)
		return
	}

	newComment := models.Comment{
		Text:   requestBody.Text,
		UserID: uint(userIDUint),
		PostID: uint(postID),
	}

	_, err = newComment.Save()
	if err != nil {
		SendInternalError(ctx, err)
		return
	}

	// token, _ := auth.GenerateToken(uint(userIDUint))

	ctx.JSON(http.StatusCreated, gin.H{"message": "Comment posted", "userID": newComment.UserID, "postID": newComment.PostID})
}

func GetCommentsByPostID(ctx *gin.Context) {
	postID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		SendInternalError(ctx, err)
		return
	}
	comments, err := models.FetchCommentsByPostID(postID)
	if err != nil {
		SendInternalError(ctx, err)
		return
	}
	jsonComments := make([]JSONComment, 0)
	for _, comment := range *comments {

		commentUserID := strconv.FormatUint(uint64(comment.UserID), 10)
		commentUser, err := models.FindUser(commentUserID)
		if err != nil {
			SendInternalError(ctx, err)
			return
		}
		jsonComments = append(jsonComments, JSONComment{
			ID:       comment.ID,
			Text:     comment.Text,
			Username: commentUser.Username,
		})
	}

	ctx.JSON(http.StatusOK, gin.H{"comments": jsonComments})
}
