package models
import (
	"time"

)
type AttendanceRoom struct {
	ID          uint      `gorm:"primaryKey"`
	RoomID      int       `gorm:"not null"`
	SubjectID   int       `gorm:"not null"`
	StartTime   time.Time `gorm:"not null"`
	EndTime     time.Time `gorm:"not null"`
	LocationLat float64   `gorm:"not null"`
	LocationLon float64   `gorm:"not null"`
}