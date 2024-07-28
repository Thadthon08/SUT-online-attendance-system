// main.go
package main

import (
	"myproject/config"
	"myproject/controllers"

	//  "myproject/middlewares"

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

    // Protected routes
    // auth := r.Group("/auth")
    // auth.Use(middleware.AuthMiddleware())
    // auth.GET("/users", controllers.GetUsers)

    // Run the server
    r.Run() // default listens on :8080
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