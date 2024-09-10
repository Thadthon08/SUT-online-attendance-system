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
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	// ตรวจสอบว่า SubjectID มีอยู่ในฐานข้อมูลหรือไม่
	var subject models.Subject
	if err := config.DB.First(&subject, "subject_id = ?", attendanceRoom.SubjectID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Subject not found"})
		return
	}

	// บันทึกข้อมูลลงในฐานข้อมูล
	if err := config.DB.Create(&attendanceRoom).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}

	// ตอบกลับเมื่อบันทึกข้อมูลสำเร็จ
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Attendance room has been created",
		"data":    attendanceRoom,
	})
}

func GetAttendanceRoom(c *gin.Context) {
	id := c.Param("id")  // เปลี่ยนจาก room_id เป็น id

	var attendanceRoom models.AttendanceRoom
	if err := config.DB.Where("room_id = ?", id).Preload("Subject").Preload("Attendances").First(&attendanceRoom).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "AttendanceRoom not found"})
		return
	}

	c.JSON(http.StatusOK, attendanceRoom)
}



