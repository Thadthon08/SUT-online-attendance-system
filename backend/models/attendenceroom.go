package models

import (
	"time"
)

type AttendanceRoom struct {
	RoomID      int           `gorm:"primaryKey;autoIncrement" json:"room_id"`
	SubjectID   string        `gorm:"not null" json:"subject_id"`
	Subject     Subject       `gorm:"foreignKey:SubjectID" json:"subject"`
	RoomName    string        `json:"room_name"`
	StartTime   time.Time     `gorm:"not null" json:"start_time"`
	EndTime     time.Time     `gorm:"not null" json:"end_time"`
	LocationLat float64       `gorm:"not null" json:"location_lat"`
	LocationLon float64       `gorm:"not null" json:"location_lon"`
	Attendances []Attendance  `gorm:"foreignKey:RoomID" json:"attendances"`
}
