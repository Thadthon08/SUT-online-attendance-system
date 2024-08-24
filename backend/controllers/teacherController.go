// controllers/userController.go
package controllers

import (
	"myproject/config"
	"myproject/models"
	"net/http"

	"github.com/gin-gonic/gin"
)



func GetTeacher(c *gin.Context) {
    var teacher []models.Teacher
    config.DB.Find(&teacher)
    c.JSON(http.StatusOK, teacher)
}

func GetTeacherById(c *gin.Context) {
    id := c.Param("id")
    var teacher models.Teacher
    if err := config.DB.Preload("Subjects").First(&teacher, "teacher_id = ?", id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Teacher not found"})
        return
    }
    c.JSON(http.StatusOK, teacher)
}


func GetTeacherSubjects(c *gin.Context) {
    teacherID := c.Param("id")
    var subjects []models.Subject

    err := config.DB.
        Model(&models.Subject{}).
        Joins("JOIN teacher_subjects ON teacher_subjects.subject_id = subjects.subject_id").
        Where("teacher_subjects.teacher_id = ?", teacherID).
        Preload("Teachers").
        Find(&subjects).Error

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, subjects)
}