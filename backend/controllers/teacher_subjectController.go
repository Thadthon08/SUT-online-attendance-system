package controllers

import (
	"net/http"
    "myproject/config"
    "myproject/models"  
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
