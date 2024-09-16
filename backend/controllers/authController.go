package controllers

import (
	"log"
	"myproject/config"
	"myproject/models"
	"net/http"
	"os"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte(os.Getenv("JWT_SECRET")) 

type Credentials struct {
	TeacherID   string `json:"teacher_id" valid:"required"`
	FirstName   string `json:"firstname" valid:"required"`
	LastName    string `json:"lastname" valid:"required"`
	PhoneNumber string `json:"phone_number" valid:"required"`
	Email       string `json:"email" valid:"required,email"`
	Password    string `json:"password" valid:"required,stringlength(6|50)"`
	ProfilePic  string `json:"profile_pic"`
}

type Claims struct {
	TeacherID string `json:"teacher_id"`
	jwt.RegisteredClaims
}

func Signup(c *gin.Context) {
	var creds Credentials
	if err := c.BindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	_, err := govalidator.ValidateStruct(creds)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating password hash"})
		return
	}

	teacher := models.Teacher{
		TeacherID:   creds.TeacherID,
		FirstName:   creds.FirstName,
		LastName:    creds.LastName,
		PhoneNumber: creds.PhoneNumber,
		Email:       creds.Email,
		Password:    string(hashedPassword),
		ProfilePic:  creds.ProfilePic,
	}

	if err := config.DB.Create(&teacher).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Teacher already exists or error occurred"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Teacher created successfully"})
}

type LoginCredentials struct {
	TeacherID string `json:"teacher_id" valid:"required"`
	Password  string `json:"password" valid:"required,stringlength(6|50)"`
}


func Login(c *gin.Context) {
	// Define a struct for Login Credentials
	var creds LoginCredentials
	if err := c.BindJSON(&creds); err != nil {
		log.Printf("Error binding JSON: %v", err) // Log error for debugging
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Validate the input credentials
	_, err := govalidator.ValidateStruct(creds)
	if err != nil {
		log.Printf("Validation error: %v", err) // Log error for debugging
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	// Look up the teacher in the database
	var teacher models.Teacher
	if err := config.DB.Where("teacher_id = ?", creds.TeacherID).First(&teacher).Error; err != nil {
		log.Printf("Database error: %v", err) // Log error for debugging
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Verify the provided password against the stored hash
	if err := bcrypt.CompareHashAndPassword([]byte(teacher.Password), []byte(creds.Password)); err != nil {
		log.Printf("Password comparison error: %v", err) // Log error for debugging
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Set token expiration time
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		TeacherID: creds.TeacherID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	// Create and sign the JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating token"})
		return
	}

	// Construct the token response
	tokenResponse := map[string]interface{}{
		"access_token": tokenString,
		"token_type":   "Bearer",
		"expires_in":   int(expirationTime.Sub(time.Now()).Seconds()), // Token expiry in seconds
	}

	// Construct the user response if necessary
	userResponse := map[string]string{
		"teacher_id":   teacher.TeacherID,
		"firstname":    teacher.FirstName,
		"lastname":     teacher.LastName,
		"email":        teacher.Email,
		"phone_number": teacher.PhoneNumber,
		"profile_pic":  teacher.ProfilePic,
	}

	// Respond with both token and user data
	c.JSON(http.StatusOK, gin.H{
		"token": tokenResponse,
		"user":  userResponse,
	})
}

