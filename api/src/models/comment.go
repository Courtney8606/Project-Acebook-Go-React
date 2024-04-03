package models

import (
	"gorm.io/gorm"
)

type Comment struct {
	gorm.Model
	Text   string `json:"text"`
	UserID uint   `json:"user_id"`
	PostID uint   `json:"post_id"`
}

func (comment *Comment) Save() (*Comment, error) {
	err := Database.Create(comment).Error
	if err != nil {
		return &Comment{}, err
	}

	return comment, nil
}

func FetchCommentsByPostID(post_id int) (*[]Comment, error) {
	var comments []Comment
	err := Database.Where("post_id = ?", post_id).Order("created_at DESC").Find(&comments).Error
	if err != nil {
		return nil, err
	}
	return &comments, nil
}
