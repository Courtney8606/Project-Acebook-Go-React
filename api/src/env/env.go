package env

import (
	"log"

	"github.com/joho/godotenv"
)

func LoadEnv(filenames ...string) {
	err := godotenv.Load(filenames...)
	if err != nil {
		log.Fatal(err)
	}

	log.Println(".env file successfully loaded")
}
