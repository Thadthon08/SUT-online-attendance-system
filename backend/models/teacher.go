package models

type Teacher struct {
	TeacherID   string    `json:"teacher_id" gorm:"primaryKey"`
	FirstName   string    `json:"firstname"`
	LastName    string    `json:"lastname"`
	PhoneNumber string    `json:"phone_number"`
	Email       string    `json:"email" gorm:"unique"`
	Password    string    `json:"-"`
	ProfilePic  string    `json:"profile_pic"`
	Subjects    []Subject `gorm:"many2many:teacher_subjects;foreignKey:TeacherID;joinForeignKey:TeacherID;References:SubjectID;joinReferences:SubjectID" json:"subjects"`
}
