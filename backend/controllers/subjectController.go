package controllers

import (
	"myproject/config"
	"myproject/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetSubjects(c *gin.Context) {
    var subjects []models.Subject
    config.DB.Preload("Teachers").Find(&subjects)
    c.JSON(http.StatusOK, subjects)
}

func CreateSubject(c *gin.Context) {
    var subject models.Subject
    if err := c.ShouldBindJSON(&subject); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    config.DB.Create(&subject)
    c.JSON(http.StatusOK, subject)
}

func GetSubjectByTd(c *gin.Context) {
    id := c.Param("id")
    var subject models.Subject
    if err := config.DB.Preload("Teachers").First(&subject, "subject_id = ?", id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Subject not found"})
        return
    }
    c.JSON(http.StatusOK, subject)
}