package main

import (
	"myproject/config"
	"myproject/controllers"
	"os" // เพิ่มเพื่อใช้งาน Environment Variables

	"github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

    // Initialize the database
    config.InitDatabase()
    r.Use(CORSMiddleware())

    // Public routes
    r.POST("/signup", controllers.Signup)
    r.POST("/login", controllers.Login)

    // Teachers
    r.GET("/teacher", controllers.GetTeacher)
    r.GET("/teachers/:id/subjects", controllers.GetTeacherSubjects)

    // Subjects
    r.POST("/subjects", controllers.CreateSubject)
    r.GET("/subjects", controllers.GetSubjects)
    r.GET("/subjects/:id", controllers.GetSubjectByTd)

    r.POST("/assign", controllers.CreateTeacherSubject)

    r.POST("/attendance", controllers.CreateAttendanceRoom)
    r.GET("/attendance/room/:id", controllers.GetAttendanceRoom)
    r.GET("/attendance/room/subject/:id", controllers.GetAttendanceRoomBySubjectID)
	r.POST("/attendance/student", controllers.CreateAttendance)

    r.GET("/attendance_rooms/:id/students", controllers.GetStudentsByAttendanceRoomID)


    // Protected routes
    // auth := r.Group("/auth")
    // auth.Use(middleware.AuthMiddleware())
    // auth.GET("/users", controllers.GetUsers)

    // Get the port from the environment variable, or use the default
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080" // Default port if not set
    }

    // Run the server
    r.Run(":" + port)
}

func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}