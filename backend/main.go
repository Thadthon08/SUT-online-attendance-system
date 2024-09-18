package main

import (
	"os"

	"myproject/config"
	"myproject/controllers"
	middleware "myproject/middlewares"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Initialize the database
	config.InitDatabase()

	// Apply CORS middleware globally
	r.Use(CORSMiddleware())

	// Public routes
	publicRoutes := r.Group("/")
	{
		publicRoutes.POST("/signup", controllers.Signup)
		publicRoutes.POST("/login", controllers.Login)
		publicRoutes.GET("/attendance/room/:id", controllers.GetAttendanceRoom)
		publicRoutes.POST("/attendance/student", controllers.CreateAttendance)


	}

	// Protected routes
	protectedRoutes := r.Group("/")
	protectedRoutes.Use(middleware.AuthMiddleware()) 
	{
		// Teachers
		protectedRoutes.GET("/teacher", controllers.GetTeacher)
		protectedRoutes.GET("/teachers/:id/subjects", controllers.GetTeacherSubjects)

		// Subjects
		protectedRoutes.POST("/subjects", controllers.CreateSubject)
		protectedRoutes.GET("/subjects", controllers.GetSubjects)
		protectedRoutes.GET("/subjects/:id", controllers.GetSubjectByTd)

		// Assignments and attendance
		protectedRoutes.POST("/assign", controllers.CreateTeacherSubject)
		protectedRoutes.POST("/attendance", controllers.CreateAttendanceRoom)
		protectedRoutes.GET("/attendance/room/subject/:id", controllers.GetRoomDetailsBySubjectID)
		protectedRoutes.GET("/attendance_rooms/:id/students", controllers.GetStudentsByAttendanceRoomID)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not set
	}

	// Run the server
	r.Run(":" + port)
}

// CORSMiddleware is a middleware function that adds CORS headers to the response
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
