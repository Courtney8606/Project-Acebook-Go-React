package auth

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type AuthToken struct {
	ExpiresAt time.Time
	IssuedAt  time.Time
	UserID    string
}

var secret = os.Getenv("JWT_SECRET")

func GenerateToken(userID string) (string, error) {
	now := time.Now()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userID,
		"iat": jwt.NewNumericDate(now),
		"exp": jwt.NewNumericDate(now.Add(time.Minute * 10)),
	})
	return token.SignedString([]byte(secret))
}

func DecodeToken(tokenString string) (AuthToken, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return secret, nil
	})

	claims, ok := token.Claims.(jwt.MapClaims)

	if ok {
		return createAuthTokenFromClaims(claims)
	} else {
		return AuthToken{}, err
	}
}

func (authToken AuthToken) IsValid() bool {
	now := time.Now()
	return now.After(authToken.IssuedAt) && now.Before(authToken.ExpiresAt)
}

func createAuthTokenFromClaims(claims jwt.MapClaims) (AuthToken, error) {
	expiresAt, err := claims.GetExpirationTime()
	if err != nil {
		return AuthToken{}, err
	}

	issuedAt, err := claims.GetIssuedAt()
	if err != nil {
		return AuthToken{}, err
	}

	userID, err := claims.GetSubject()
	if err != nil {
		return AuthToken{}, err
	}

	return AuthToken{
		ExpiresAt: expiresAt.Time,
		IssuedAt:  issuedAt.Time,
		UserID:    userID,
	}, nil
}
