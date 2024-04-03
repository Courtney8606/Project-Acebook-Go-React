package models

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Database *gorm.DB

func OpenDatabaseConnection() {
	connection_string := os.Getenv("POSTGRES_URL")
	// fmt.Println(connection_string)

	var err error
	Database, err = gorm.Open(postgres.Open(connection_string), &gorm.Config{})

	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected to database")
}

func AutoMigrateModels() {
	Database.AutoMigrate(&User{})
	Database.AutoMigrate(&Post{})
	Database.AutoMigrate(&Comment{})
}
