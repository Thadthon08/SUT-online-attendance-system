package controllers

import (
	"myproject/config"
	"myproject/models"
	"net/http"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("my_secret_key")

type Credentials struct {
	TeacherID	   string `json:"teacher_id" valid:"required"`
    FirstName   string `json:"firstname"`
    LastName    string `json:"lastname"`
    PhoneNumber string `json:"phone_number"`
    Email    string `json:"email" valid:"email"`
    Password string `json:"password" valid:"required,stringlength(6|50)"`
    ProfilePic string `json:"profile_pic"`
}

type Claims struct {
    TeacherID string `json:"teacher_id"`
    jwt.StandardClaims
}

func Signup(c *gin.Context) {
    var creds Credentials
    if err := c.BindJSON(&creds); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Validate the input
    _, err := govalidator.ValidateStruct(creds)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), bcrypt.DefaultCost)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    teacher := models.Teacher{TeacherID: creds.TeacherID, FirstName:creds.FirstName, LastName: creds.LastName, PhoneNumber: creds.PhoneNumber, Email: creds.Email, Password: string(hashedPassword), ProfilePic: creds.ProfilePic}
    if err := config.DB.Create(&teacher).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Teacher already exists"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "teacher created successfully"})
}

func Login(c *gin.Context) {
    var creds Credentials
    if err := c.BindJSON(&creds); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Validate the input
    _, err := govalidator.ValidateStruct(creds)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var teacher models.Teacher
    if err := config.DB.Where("teacher_id = ?", creds.TeacherID).First(&teacher).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
        return
    }

    if err := bcrypt.CompareHashAndPassword([]byte(teacher.Password), []byte(creds.Password)); err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
        return
    }

    expirationTime := time.Now().Add(24 * time.Hour)
    claims := &Claims{
        TeacherID: creds.TeacherID,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    tokenString, err := token.SignedString(jwtKey)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

		tokenResponse := map[string]string{"token": tokenString, "teacher_id": creds.TeacherID, "firstname": teacher.FirstName, "lastname": teacher.LastName, "email": teacher.Email, "phone_number": teacher.PhoneNumber, "profile_pic": teacher.ProfilePic} 

    c.JSON(http.StatusOK, gin.H{"token": tokenResponse})
}
