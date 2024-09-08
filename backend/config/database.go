package config

import (
	"log"
	"myproject/models"
	"os" // เพิ่มเพื่อใช้งาน Environment Variables

	"gorm.io/driver/sqlite" // ใช้ SQLite driver
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDatabase() {
    var err error

    // ใช้ Environment Variable DATABASE_PATH หากมี หรือใช้ค่า default "./test.db"
    dbPath := os.Getenv("DATABASE_PATH")
    if dbPath == "" {
        dbPath = "./test.db" // Default path if not set
    }

    // เปิดการเชื่อมต่อกับฐานข้อมูล
    DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    } else {
        log.Println("Database connection successful")
    }

    // ทำการ Migrate schema
    err = DB.AutoMigrate(
        &models.Teacher{},
        &models.Subject{},
        &models.TeacherSubject{},
        &models.AttendanceRoom{},
        &models.Attendance{},
        &models.Student{},
    )
    if err != nil {
        log.Fatal("Failed to migrate database schema:", err)
    }
}
