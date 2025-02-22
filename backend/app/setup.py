import os
import time
import psycopg2


def get_connection():
    return psycopg2.connect(
        dbname="foodisave",
        user="postgres",  # change if needed
        password="naPraPatenAxeL13.",
        host="db",  # Use the DB_HOST variable
        port="5432",  # Use the DB_PORT variable
    )


def create_tables():

    con = get_connection()

    commands = (
        """
        CREATE TABLE IF NOT EXISTS contacts (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            city VARCHAR(100) NOT NULL,
            gender VARCHAR(50) NOT NULL,
            terms_of_agreement BOOLEAN NOT NULL
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            firstname VARCHAR(255) NOT NULL,
            lastname VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            terms BOOLEAN NOT NULL
        )
        """,
    )

    with con:
        with con.cursor() as cursor:
            for command in commands:
                cursor.execute(command)


if __name__ == "__main__":
    # Wait for the database to be ready
    time.sleep(5)
    create_tables()
