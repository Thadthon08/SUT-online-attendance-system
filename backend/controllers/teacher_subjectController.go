package controllers

import (
	"myproject/config"
	"myproject/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type TeacherSubjectInput struct {
	TeacherID string `json:"teacher_id" binding:"required"`
	SubjectID string `json:"subject_id" binding:"required"`
}

// CreateTeacherSubject creates a new relation between teacher and subject
func CreateTeacherSubject(c *gin.Context) {
	var input TeacherSubjectInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่า TeacherID นั้นมีอยู่ในฐานข้อมูลหรือไม่
	var teacher models.Teacher
	if err := config.DB.First(&teacher, "teacher_id = ?", input.TeacherID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Teacher not found"})
		return
	}

	// ตรวจสอบว่า SubjectID นั้นมีอยู่ในฐานข้อมูลหรือไม่
	var subject models.Subject
	if err := config.DB.First(&subject, "subject_id = ?", input.SubjectID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Subject not found"})
		return
	}

	// สร้างความสัมพันธ์ใหม่ระหว่างครูและวิชา
	teacherSubject := models.TeacherSubject{
		TeacherID: input.TeacherID,
		SubjectID: input.SubjectID,
	}

	if err := config.DB.Create(&teacherSubject).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, teacherSubject)
}
