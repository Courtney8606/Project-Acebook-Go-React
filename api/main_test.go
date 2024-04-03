package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/auth"
	"github.com/makersacademy/go-react-acebook-template/api/src/controllers"
	"github.com/makersacademy/go-react-acebook-template/api/src/env"
	"github.com/makersacademy/go-react-acebook-template/api/src/models"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"gorm.io/gorm"
)

type TestSuiteEnv struct {
	suite.Suite
	db      *gorm.DB
	token   string
	token2  string
	userID  int
	userID2 int
	app     *gin.Engine
	res     *httptest.ResponseRecorder
}

// Tests are run before they start
func (suite *TestSuiteEnv) SetupSuite() {
	env.LoadEnv(".test.env")
	models.OpenDatabaseConnection()
	models.AutoMigrateModels()
	suite.db = models.Database
	suite.app = setupApp()
	suite.userID = 1
	suite.token, _ = auth.GenerateToken(uint(suite.userID))
	suite.userID2 = 2
	suite.token2, _ = auth.GenerateToken(uint(suite.userID2))

}

func (suite *TestSuiteEnv) SetupTest() {
	suite.res = httptest.NewRecorder()
	suite.TearDownTest()
}

// Running after each test
func (suite *TestSuiteEnv) TearDownTest() {
	suite.db.Exec("DELETE FROM comments")
	suite.db.Exec("DELETE FROM posts")
	suite.db.Exec("DELETE FROM users")

}

// This gets run automatically by `go test` so we call `suite.Run` inside it
func TestSuite(t *testing.T) {
	// This is what actually runs our suite
	suite.Run(t, new(TestSuiteEnv))
}

// Can create a user successfully
func (suite *TestSuiteEnv) Test_PostUsers_CorrectJSON() {
	app, token := suite.app, suite.token

	res := httptest.NewRecorder()
	var jsonStr = []byte(`{"email":"tester@email.com", "password": "testpassword", "username": "tester"}`)
	req, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(jsonStr))
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", token))
	app.ServeHTTP(res, req)

	assert.Equal(suite.T(), 201, res.Code)
}

// Not allowed to create a user with incorrect JSON data
func (suite *TestSuiteEnv) Test_PostUsers_IncorrectJSON() {
	app, token := suite.app, suite.token

	var jsonStr = []byte(`{"message":"Test Post"}`)
	req, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(jsonStr))
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", token))
	app.ServeHTTP(suite.res, req)

	assert.Equal(suite.T(), 400, suite.res.Code)
}

// Can retrieve all posts
func (suite *TestSuiteEnv) Test_GetPosts() {
	app, token := suite.app, suite.token
	// Create a user
	user := models.User{
		Email:    "testuser6@example.com",
		Password: "password123",
	}
	user.Save()
	newPost := models.Post{
		Message: "Test Post",
		UserID:  user.ID,
	}
	newPost.Save()

	req, _ := http.NewRequest("GET", "/posts", nil)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", token))
	app.ServeHTTP(suite.res, req)

	responseData, _ := io.ReadAll(suite.res.Body)
	var jsonPosts struct {
		Posts []controllers.JSONPost
	}

	_ = json.Unmarshal(responseData, &jsonPosts)

	assert.Equal(suite.T(), 200, suite.res.Code)
	assert.Equal(suite.T(), "Test Post", jsonPosts.Posts[0].Message)
}

// Can create a post
func (suite *TestSuiteEnv) Test_CreatePost() {
	app := suite.app

	// Create a user
	user := models.User{
		Email:    "testuser@example.com",
		Password: "password123",
	}
	user.Save()

	// Generate token for the user
	token, _ := auth.GenerateToken(user.ID)
	userID := strconv.FormatUint(uint64(user.ID), 10)
	// Create a post using the user's token
	requestBody := map[string]string{
		"message": "Test Post",
		"user_id": userID,
	}
	requestBodyBytes, _ := json.Marshal(requestBody)

	req, _ := http.NewRequest("POST", "/posts", bytes.NewBuffer(requestBodyBytes))
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", token))
	req.Header.Set("Content-Type", "application/json")

	app.ServeHTTP(suite.res, req)

	assert.Equal(suite.T(), http.StatusCreated, suite.res.Code)

	var response map[string]interface{}
	json.NewDecoder(suite.res.Body).Decode(&response)

	assert.Equal(suite.T(), "Post created", response["message"])
}

// A post is liked and the count of likes is available (for one like)
func (suite *TestSuiteEnv) Test_GetLikeCountWithOneLike() {
	app, token := suite.app, suite.token

	// Create a user
	user := models.User{
		Email:    "testuser1@example.com",
		Password: "password123",
	}
	user.Save()

	// Create a post
	newPost := models.Post{
		Message: "Test Post",
		UserID:  user.ID, // Associate the post with the created user
	}
	newPost.Save()

	// Like the post
	models.LikePost(int(newPost.ID), suite.userID)

	req, _ := http.NewRequest("GET", fmt.Sprintf("/posts/%d/like", newPost.ID), nil)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", token))

	app.ServeHTTP(suite.res, req)

	assert.Equal(suite.T(), 200, suite.res.Code)

	var response struct {
		LikeCount    int  `json:"LikeCount"`
		UserHasLiked bool `json:"UserHasLiked"`
	}
	json.NewDecoder(suite.res.Body).Decode(&response)

	assert.Equal(suite.T(), 1, response.LikeCount)
	assert.True(suite.T(), response.UserHasLiked)
}

// A post is liked and the count of likes is available (for multiple likes)
func (suite *TestSuiteEnv) Test_GetLikeCountWithMultipleLikes() {
	app, token := suite.app, suite.token

	// Create a user
	user := models.User{
		Email:    "testuser2@example.com",
		Password: "password123",
	}
	user.Save()

	// Create a post
	newPost := models.Post{
		Message: "Test Post",
		UserID:  user.ID, // Associate the post with the created user
	}
	newPost.Save()

	// Like the post twice
	models.LikePost(int(newPost.ID), int(suite.userID))
	models.LikePost(int(newPost.ID), int(suite.userID2))

	req, _ := http.NewRequest("GET", fmt.Sprintf("/posts/%d/like", newPost.ID), nil)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", token))

	app.ServeHTTP(suite.res, req)

	assert.Equal(suite.T(), 200, suite.res.Code)

	var response struct {
		LikeCount    int  `json:"LikeCount"`
		UserHasLiked bool `json:"UserHasLiked"`
	}
	json.NewDecoder(suite.res.Body).Decode(&response)

	assert.Equal(suite.T(), 2, response.LikeCount)
	assert.True(suite.T(), response.UserHasLiked)
}

// A user can like and then unlike a post successfully
func (suite *TestSuiteEnv) Test_UserUnlikePost() {
	app, token := suite.app, suite.token

	// Create a user
	user := models.User{
		Email:    "testuser3@example.com",
		Password: "password123",
	}
	user.Save()

	// Create a post
	newPost := models.Post{
		Message: "Test Post",
		UserID:  user.ID, // Associate the post with the created user
	}
	newPost.Save()

	// Like the post
	models.LikePost(int(newPost.ID), suite.userID)

	// Unlike the post
	req, _ := http.NewRequest("POST", fmt.Sprintf("/posts/%d/unlike", newPost.ID), nil)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", token))
	app.ServeHTTP(suite.res, req)

	assert.Equal(suite.T(), http.StatusOK, suite.res.Code)

	var response map[string]interface{}
	json.NewDecoder(suite.res.Body).Decode(&response)

	assert.Equal(suite.T(), "post unliked successfully", response["message"])

	post, _ := models.FetchPostById(int(newPost.ID))
	userStillLikes := models.HasUserLikedPost(*post, suite.userID)
	assert.False(suite.T(), userStillLikes)
}

// Creating a user with an invalid email does not work
func (suite *TestSuiteEnv) Test_CreateUser_InvalidEmail() {
	app, token := suite.app, suite.token

	requestBody := map[string]string{
		"email":    "invalid-email",
		"password": "testpassword",
	}
	requestBodyBytes, _ := json.Marshal(requestBody)

	req, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(requestBodyBytes))
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", token))
	req.Header.Set("Content-Type", "application/json")

	app.ServeHTTP(suite.res, req)

	assert.Equal(suite.T(), http.StatusBadRequest, suite.res.Code)
}

// Creating an empty post is not possible
func (suite *TestSuiteEnv) Test_CreatePost_InvalidPostMessage() {
	app, token := suite.app, suite.token

	// Create a user
	user := models.User{
		Email:    "testuser4@example.com",
		Password: "password123",
	}
	user.Save()

	// Attempt to create an empty post
	requestBody := map[string]string{
		"message": "",
	}
	requestBodyBytes, _ := json.Marshal(requestBody)

	req, _ := http.NewRequest("POST", "/posts", bytes.NewBuffer(requestBodyBytes))
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", token))
	req.Header.Set("Content-Type", "application/json")

	app.ServeHTTP(suite.res, req)

	assert.Equal(suite.T(), http.StatusBadRequest, suite.res.Code)
}

func (suite *TestSuiteEnv) Test_PostComment() {
	app := suite.app

	// Create a user
	user := models.User{
		Email:    "testuser1@example.com",
		Password: "password123",
	}
	user.Save()
	token, _ := auth.GenerateToken(user.ID)
	// Create a post
	newPost := models.Post{
		Message: "Test Post",
		UserID:  user.ID, // Associate the post with the created user
	}
	newPost.Save()

	// //Comment on the post
	// newComment := models.Comment{
	// 	Text:   "Test Comment",
	// 	PostID: newPost.ID,
	// 	UserID: user.ID,
	// }
	// newComment.Save()
	userID := strconv.FormatUint(uint64(user.ID), 10)
	requestBody := map[string]string{
		"text":    "Test Comment",
		"user_id": userID,
	}

	requestBodyBytes, _ := json.Marshal(requestBody)
	req, _ := http.NewRequest("POST", fmt.Sprintf("/comments/%d", newPost.ID), bytes.NewBuffer(requestBodyBytes))
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", token))
	req.Header.Set("Content-Type", "application/json")

	app.ServeHTTP(suite.res, req)

	assert.Equal(suite.T(), 201, suite.res.Code)

	var response map[string]interface{}
	json.NewDecoder(suite.res.Body).Decode(&response)

	assert.Equal(suite.T(), "Comment posted", response["message"])
	// assert.Equal(suite.T(), user.ID, response["userID"])
	// assert.Equal(suite.T(), newPost.ID, response["postID"])
}

func (suite *TestSuiteEnv) Test_GetComments() {
	app, token := suite.app, suite.token

	// Create a user
	user := models.User{
		Email:    "testuser1@example.com",
		Password: "password123",
	}
	user.Save()

	// Create a post
	newPost := models.Post{
		Message: "Test Post",
		UserID:  user.ID, // Associate the post with the created user
	}
	newPost.Save()

	// Like the post
	models.LikePost(int(newPost.ID), suite.userID)

	//Comment on the post
	newComment := models.Comment{
		Text:   "Test Comment",
		PostID: newPost.ID,
		UserID: user.ID,
	}
	newComment.Save()

	req, _ := http.NewRequest("GET", fmt.Sprintf("/comments/%d", newPost.ID), nil)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", token))

	app.ServeHTTP(suite.res, req)

	responseData, _ := io.ReadAll(suite.res.Body)
	var jsonComments struct {
		Comments []controllers.JSONComment
	}

	_ = json.Unmarshal(responseData, &jsonComments)

	assert.Equal(suite.T(), 200, suite.res.Code)
	assert.Equal(suite.T(), "Test Comment", jsonComments.Comments[0].Text)
}
