package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
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
	db    *gorm.DB
	token string
	app   *gin.Engine
	res   *httptest.ResponseRecorder
}

// Tests are run before they start
func (suite *TestSuiteEnv) SetupSuite() {
	env.LoadEnv(".test.env")
	models.OpenDatabaseConnection()
	models.AutoMigrateModels()
	suite.db = models.Database
	suite.app = setupApp()
	suite.token, _ = auth.GenerateToken(2)

}

func (suite *TestSuiteEnv) SetupTest() {
	suite.res = httptest.NewRecorder()
}

// Running after each test
func (suite *TestSuiteEnv) TearDownTest() {
	suite.db.Raw("TRUNCATE TABLE users;")
	suite.db.Raw("TRUNCATE TABLE posts;")
}

// This gets run automatically by `go test` so we call `suite.Run` inside it
func TestSuite(t *testing.T) {
	// This is what actually runs our suite
	suite.Run(t, new(TestSuiteEnv))
}

func (suite *TestSuiteEnv) Test_PostUsers_CorrectJSON() {
	app, token := suite.app, suite.token

	res := httptest.NewRecorder()
	var jsonStr = []byte(`{"email":"test@email.com", "password": "testpassword"}`)
	req, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(jsonStr))
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", token))
	app.ServeHTTP(res, req)

	assert.Equal(suite.T(), 201, res.Code)
}

func (suite *TestSuiteEnv) Test_PostUsers_IncorrectJSON() {
	app, token := suite.app, suite.token

	var jsonStr = []byte(`{"message":"Test Post"}`)
	req, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(jsonStr))
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", token))
	app.ServeHTTP(suite.res, req)

	assert.Equal(suite.T(), 400, suite.res.Code)
}

func (suite *TestSuiteEnv) Test_GetPosts() {
	app, token := suite.app, suite.token

	newPost := models.Post{
		Message: "Test Post",
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
