// config/database.go
package config

import (
	"log"
	"myproject/models"

	"gorm.io/driver/sqlite" // Replace with appropriate driver for other databases
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDatabase() {
    var err error
    DB, err = gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }else{
        log.Println("Database connection successful")
    }

    // Migrate the schema
    DB.AutoMigrate(&models.User{})
}
