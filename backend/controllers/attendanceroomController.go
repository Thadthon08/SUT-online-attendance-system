package controllers

import (
	"errors"
	"myproject/config"
	"myproject/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
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

func GetStudentsByAttendanceRoomID(c *gin.Context) {
	// รับ Room ID จากพารามิเตอร์ URL
	roomID := c.Param("id")

	// ตรวจสอบว่า roomID เป็นตัวเลข
	if _, err := strconv.Atoi(roomID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Invalid Room ID format"})
		return
	}

	var room models.AttendanceRoom

	// ดึงข้อมูล AttendanceRoom พร้อมกับข้อมูล Attendances ที่เชื่อมโยงกับ Room
	if err := config.DB.Preload("Attendances").Preload("Attendances.Room").First(&room, roomID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "AttendanceRoom not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to retrieve AttendanceRoom data"})
		}
		return
	}

	// ดึงข้อมูลนักเรียนที่เช็คชื่อ
	attendances := room.Attendances
	var students []map[string]interface{}
	for _, attendance := range attendances {
		students = append(students, map[string]interface{}{
			"student_id":  attendance.StudentID,
			"first_name":  attendance.FirstName,
			"last_name":   attendance.LastName,
			"location_lat": attendance.LocationLat,
			"location_lon": attendance.LocationLon,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"room_id": room.RoomID,
		"students": students,
	})
}




