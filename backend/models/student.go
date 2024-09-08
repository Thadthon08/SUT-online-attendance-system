package models

type Student struct {
	StudentID   string       `gorm:"primaryKey" json:"student_id"`
	FirstName   string       `json:"first_name"`
	LastName    string       `json:"last_name"`
	Attendances []Attendance `json:"attendances"`
} 
 