package models

type Attendance struct {
	AttendanceID int            `gorm:"primaryKey;autoIncrement" json:"attendance_id"`
	RoomID       int            `json:"room_id"`
	Room         AttendanceRoom `gorm:"foreignKey:RoomID" json:"room"`
	StudentID    string         `json:"student_id"`
	Student      Student        `gorm:"foreignKey:StudentID" json:"student"`
	LocationLat  float64        `json:"location_lat"`
	LocationLon  float64        `json:"location_lon"`
}
