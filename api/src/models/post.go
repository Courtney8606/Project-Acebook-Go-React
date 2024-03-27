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
}

func (post *Post) Save() (*Post, error) {
	err := Database.Create(post).Error
	if err != nil {
		return &Post{}, err
	}

	return post, nil
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

func LikePost(post_id int, user_id int) error {
	var likedPost Post
	err := Database.First(&likedPost, post_id).Error
	if err != nil {
		return err
	}
	for _, likedUserID := range likedPost.Likes {
		if likedUserID == user_id {
			return fmt.Errorf("user has liked post already")
		}
	} //by this point, we know the user has NOT liked the given post
	likedPost.Likes = append(likedPost.Likes, user_id)
	err = Database.Save(likedPost).Error
	if err != nil {
		return err
	}
	return nil
}
