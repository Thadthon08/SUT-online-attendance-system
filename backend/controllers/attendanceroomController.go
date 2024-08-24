package controllers

import (
	"myproject/config"
	"myproject/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateAttendanceRoom(c *gin.Context) {
	var attendanceRoom models.AttendanceRoom
	if err := c.ShouldBindJSON(&attendanceRoom); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่า SubjectID มีอยู่ในฐานข้อมูลหรือไม่
	var subject models.Subject
	if err := config.DB.First(&subject, "subject_id = ?", attendanceRoom.SubjectID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Subject not found"})
		return
	}

	// บันทึกข้อมูลลงในฐานข้อมูล
	if err := config.DB.Create(&attendanceRoom).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, attendanceRoom)
}
