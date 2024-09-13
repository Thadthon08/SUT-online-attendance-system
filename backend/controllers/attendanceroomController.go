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


	var subject models.Subject
	if err := config.DB.First(&subject, "subject_id = ?", attendanceRoom.SubjectID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Subject not found"})
		return
	}


	if err := config.DB.Create(&attendanceRoom).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}


	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Attendance room has been created",
		"data":    attendanceRoom,
	})
}

func GetRoomDetailsBySubjectID(c *gin.Context) {
	subjectID := c.Param("id")

	var attendanceRooms []models.AttendanceRoom // ใช้ slice ของ AttendanceRoom เพื่อเก็บข้อมูลทั้งหมด

	// Query เพื่อดึงข้อมูลของ attendance_rooms ที่มี subject_id ตรงกับที่ระบุ
	if err := config.DB.
		Preload("Subject"). // โหลดข้อมูล Subject ที่เกี่ยวข้อง
		Where("subject_id = ?", subjectID). // กรองตาม subject_id
		Find(&attendanceRooms).Error; err != nil { // เก็บผลลัพธ์ใน attendanceRooms
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Rooms not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to retrieve room details"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   attendanceRooms,
	})
}

func GetAttendanceRoom(c *gin.Context) {
	id := c.Param("id")

	var attendanceRoom models.AttendanceRoom

	if err := config.DB.
		Preload("Subject").                           
		Preload("Attendances").                      
		Preload("Attendances.Room").                  
		Preload("Attendances.Room.Subject").        
		First(&attendanceRoom, "room_id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "AttendanceRoom not found"})
		return
	}

	c.JSON(http.StatusOK, attendanceRoom)
}


func GetStudentsByAttendanceRoomID(c *gin.Context) {
	roomID := c.Param("id")

	if _, err := strconv.Atoi(roomID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Invalid Room ID format"})
		return
	}

	var room models.AttendanceRoom

	if err := config.DB.Preload("Attendances").Preload("Attendances.Room").First(&room, roomID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "AttendanceRoom not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to retrieve AttendanceRoom data"})
		}
		return
	}

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



