package models

type Attendance struct {
	AttendanceID int            `gorm:"primaryKey;autoIncrement" json:"attendance_id"`
	RoomID       int            `json:"room_id"`
	Room         AttendanceRoom `gorm:"foreignKey:RoomID" json:"room"`
	StudentID   string       `json:"student_id"`
	FirstName   string       `json:"first_name"`
	LastName    string       `json:"last_name"`
	LocationLat  float64        `json:"location_lat"`
	LocationLon  float64        `json:"location_lon"`
}
