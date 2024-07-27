package models


type TeacherSubject struct {
	TeacherID string `gorm:"primaryKey"`
	SubjectID string `gorm:"primaryKey"`
}
