package controllers

import (
	"myproject/config"
	"myproject/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// func CreateAttendance(c *gin.Context) {
// 	var attendance models.Attendance
// 	if err := c.ShouldBindJSON(&attendance); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
// 		return
// 	}

// 	var room models.AttendanceRoom
// 	if err := config.DB.First(&room, "room_id = ?", attendance.RoomID).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Room not found"})
// 		return
// 	}

// 	if err := config.DB.Create(&attendance).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"status":  "success",
// 		"message": "Attendance record has been created",
// 		"data":    attendance,
// 	})
// }

func CreateAttendance(c *gin.Context) {
	var attendance models.Attendance

	// ตรวจสอบการรับข้อมูล JSON
	if err := c.ShouldBindJSON(&attendance); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	// ตรวจสอบว่ามี RoomID ที่ถูกต้องหรือไม่
	var room models.AttendanceRoom
	if err := config.DB.First(&room, "room_id = ?", attendance.RoomID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Room not found"})
		return
	}

	// ตรวจสอบว่า LineID นี้ได้เช็คชื่อใน RoomID นี้แล้วหรือยัง
	var existingAttendance models.Attendance
	if err := config.DB.Where("room_id = ? AND line_id = ?", attendance.RoomID, attendance.LineID).First(&existingAttendance).Error; err == nil {
		// หากพบว่ามีการเช็คชื่อไปแล้ว
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "This LineID has already checked in for this room",
		})
		return
	} else if err != nil && err != gorm.ErrRecordNotFound {
		// ตรวจสอบว่ามีข้อผิดพลาดอื่น ๆ ที่ไม่ใช่การไม่พบข้อมูล
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to check existing attendance"})
		return
	}

	// หากยังไม่มีการเช็คชื่อในห้องนี้มาก่อน ก็สร้าง record ใหม่
	if err := config.DB.Create(&attendance).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}

	// ส่งข้อมูลกลับไปยัง client
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Attendance record has been created",
		"data":    attendance,
	})
}



func GetAttendance(c *gin.Context) {
	id := c.Param("id")
	var attendance models.Attendance

	if err := config.DB.Preload("Room").First(&attendance, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Attendance record not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"data":    attendance,
	})
}

func UpdateAttendance(c *gin.Context) {
	id := c.Param("id")
	var attendance models.Attendance

	if err := config.DB.First(&attendance, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Attendance record not found"})
		return
	}

	if err := c.ShouldBindJSON(&attendance); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	if err := config.DB.Save(&attendance).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Attendance record has been updated",
		"data":    attendance,
	})
}


func DeleteAttendance(c *gin.Context) {
	id := c.Param("id")

	if err := config.DB.Delete(&models.Attendance{}, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Attendance record not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Attendance record deleted successfully",
	})
}