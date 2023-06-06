package repositories

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

const connectionString = "postgres://pqoahzwf:FRmxlyg-uSw8vrU3570SROcQg9AEd9vR@mouse.db.elephantsql.com/pqoahzwf"

var db *sqlx.DB

func InitializeDB() {
	var err error
	db, err = sqlx.Open("postgres", connectionString)
	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("DB opened")
}

func CloseDB() {
	err := db.Close()
	if err != nil {
		panic(err)
	}

	fmt.Println("DB closed")
}
