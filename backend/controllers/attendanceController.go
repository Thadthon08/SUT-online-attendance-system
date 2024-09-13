package controllers

import (
	"myproject/config"
	"myproject/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateAttendance(c *gin.Context) {
	var attendance models.Attendance
	if err := c.ShouldBindJSON(&attendance); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	var room models.AttendanceRoom
	if err := config.DB.First(&room, "room_id = ?", attendance.RoomID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Room not found"})
		return
	}

	if err := config.DB.Create(&attendance).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}

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