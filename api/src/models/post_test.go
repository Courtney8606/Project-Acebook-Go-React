package models

import (
	"fmt"
	"testing"
)

func TestLikedPost(t *testing.T) {
	post := Post{
		Message: "Test Post",
	}
	fmt.Println(post)

	savedPost, err := post.Save()
	if err != nil {
		t.Fatalf("failed to save the test post: %v", err)
	}

	userID := 1

	postIDint := int(savedPost.ID)
	err = LikePost(postIDint, userID)
	if err != nil {
		t.Fatalf("failed to like post: %v", err)
	}

	updatedPost, _ := FetchPostById(postIDint)
	expectedLikes := []int{userID}
	var slicesAreEqual bool
	for i := range updatedPost.Likes {
		if updatedPost.Likes[i] != expectedLikes[i] {
			slicesAreEqual = false
		} else {
			slicesAreEqual = true
		}
	}

	err = post.Delete()
	if err != nil {
		t.Fatalf("failed to delete the test post: %v", err)
	}

	if slicesAreEqual == false {
		t.Fatalf("unexpected likes, got: %v but expected %v", updatedPost.Likes, expectedLikes)
	}

}
