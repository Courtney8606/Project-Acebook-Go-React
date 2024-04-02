package models

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"

	"gorm.io/gorm"
)

type IntSlice []int

// Scan is a method that always runs when GORM reads from a DB
func (is *IntSlice) Scan(value interface{}) error {
	if value == nil {
		*is = []int{}
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("invalid data type for intslice")
	}
	return json.Unmarshal(bytes, is)
}

// Value is a methid that GORM runs when writing data to the DB
func (is IntSlice) Value() (driver.Value, error) {
	return json.Marshal(is)
}

type Post struct {
	gorm.Model
	Message string   `json:"message"`
	Likes   IntSlice `gorm:"type:json;column:liked_user_ids" json:"liked_user_ids"`
	UserID  uint     `json:"user_id"`
}

func (post *Post) Save() (*Post, error) {
	post.Likes = make([]int, 0)
	err := Database.Create(post).Error
	fmt.Println(err)
	if err != nil {
		return &Post{}, err
	}

	return post, nil
}

func (post *Post) Delete() error {
	err := Database.Delete(post).Error
	if err != nil {
		return err
	}
	return nil
}

func FetchAllPosts() (*[]Post, error) {
	var posts []Post
	err := Database.Find(&posts).Error

	fmt.Println(posts)

	if err != nil {
		return &[]Post{}, err
	}

	return &posts, nil
}

func FetchPostById(post_id int) (*Post, error) {
	var post Post
	err := Database.First(&post, post_id).Error
	if err != nil {
		return &Post{}, err
	}
	return &post, nil
}

func DeletePostByID(post_id int) error {
	var post Post
	err := Database.Delete(&post, post_id).Error
	if err != nil {
		return err
	}
	return nil
}

func HasUserLikedPost(post Post, user_id int) bool {
	for _, likedUserID := range post.Likes {
		if likedUserID == user_id {
			return true
		}
	}
	return false
}

func LikePost(post_id int, user_id int) error {
	var likedPost Post
	err := Database.First(&likedPost, post_id).Error
	if err != nil {
		return err
	}
	if HasUserLikedPost(likedPost, user_id) {
		return fmt.Errorf("user has liked post already")
	}
	likedPost.Likes = append(likedPost.Likes, user_id)
	err = Database.Save(likedPost).Error
	if err != nil {
		return err
	}
	return nil
}

func UnlikePost(post_id int, user_id int) error {
	var likedPost Post
	err := Database.First(&likedPost, post_id).Error
	if err != nil {
		return err
	}
	if !HasUserLikedPost(likedPost, user_id) {
		return fmt.Errorf("user hasn't liked post")
	}
	likedPost.Likes = removeValueFromSlice(likedPost.Likes, user_id)
	err = Database.Save(likedPost).Error
	if err != nil {
		return err
	}
	return nil
}

func removeValueFromSlice(slice []int, toRemove int) []int {
	index := -1
	for i, value := range slice {
		if value == toRemove {
			index = i
			break
		}
	}

	if index != -1 {
		result := append([]int{}, slice[:index]...) //appends all the values up to
		result = append(result, slice[index+1:]...) //appends all the value after
		return result
	}

	return slice
}
