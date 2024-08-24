package models

type Subject struct {
	SubjectID   string           `gorm:"primaryKey" json:"subject_id"`
	SubjectName string           `json:"subject_name"`
	SubjectPic  string           `json:"subject_pic"`
	Teachers    []Teacher        `gorm:"many2many:teacher_subjects;foreignKey:SubjectID;joinForeignKey:SubjectID;References:TeacherID;joinReferences:TeacherID" json:"teachers"`
	Rooms       []AttendanceRoom `json:"rooms"`
}
