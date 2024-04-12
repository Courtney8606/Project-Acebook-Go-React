package controllers

import (
	"fmt"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/models"
)

var (
	filePath       = "../images/"
	maxSize  int64 = 10485760
)

func GetProfilePicForUser(ctx *gin.Context) {
	userID := ctx.Param("id")
	user, err := models.FindUser(userID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "No user found"})
		return
	}

	var picture string
	if user.ProfilePic == "" {
		picture = "default.png"
		// fmt.Println("loaded default")
	} else {
		picture = user.ProfilePic
		// fmt.Println("loaded user's profile picture")
	}

	pictureFilePath := filepath.Join(filePath, picture)

	ctx.File(pictureFilePath)
}

func UploadProfilePicture(ctx *gin.Context) {
	file, err := ctx.FormFile("profile_picture")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	if !isImage(file) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Uploaded file is not an image"})
		return
	}

	if file.Size > maxSize {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Uploaded file cannot be larger than 10MB"})
		return
	}

	userID := ctx.GetString("userID")

	user, err := models.FindUser(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find user"})
		return
	}

	var picFilePath string
	var filename string
	if user.ProfilePic == "" {
		filename = userID + "_1" + filepath.Ext(file.Filename)
		picFilePath = filepath.Join(filePath, filename)
	} else {
		nameParts := strings.Split(user.ProfilePic, "_")
		versionWithExtension := nameParts[1]
		versionParts := strings.Split(versionWithExtension, ".")
		version, _ := strconv.Atoi(versionParts[0])
		newVersion := strconv.Itoa(version + 1)
		filename = userID + "_" + newVersion + filepath.Ext(file.Filename)
		picFilePath = filepath.Join(filePath, filename)

		err = deleteProfilePicture(user.ProfilePic)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete existing profile picture"})
			fmt.Println(err)
			return
		}
	}

	err = ctx.SaveUploadedFile(file, picFilePath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file to folder"})
		return
	}

	user.ProfilePic = filename
	_, err = user.Save()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save profile picture to database"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Profile picture uploaded successfully"})
}

func isImage(file *multipart.FileHeader) bool {
	// Get the MIME type of the file
	fileHeader, err := file.Open()
	if err != nil {
		return false
	}
	defer fileHeader.Close()

	buffer := make([]byte, 512)
	_, err = fileHeader.Read(buffer)
	if err != nil {
		return false
	}

	// Check if the file's magic number matches common image file formats
	mimeType := http.DetectContentType(buffer)
	switch mimeType {
	case "image/jpeg", "image/jpg", "image/png", "image/gif":
		return true
	default:
		return false
	}
}

func deleteProfilePicture(filename string) error {
	filePath := filepath.Join(filePath, filename)
	err := os.Remove(filePath)
	if err != nil {
		return err
	}
	return nil
}
