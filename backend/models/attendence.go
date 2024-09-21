package models

import "time"
type Attendance struct {
	AttendanceID int            `gorm:"primaryKey;autoIncrement" json:"attendance_id"`
	RoomID       int            `json:"room_id"`
	Room         AttendanceRoom `gorm:"foreignKey:RoomID;references:RoomID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"room"`
	StudentID    string         `json:"student_id"`
	FirstName    string         `json:"first_name"`
	LastName     string         `json:"last_name"`
	LineID       string         `json:"line_id"`
	LocationLat  float64        `json:"location_lat"`
	LocationLon  float64        `json:"location_lon"`
	CreatedAt    time.Time      `json:"created_at"`
}