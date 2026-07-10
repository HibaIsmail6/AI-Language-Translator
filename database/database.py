import sqlite3
from pathlib import Path

# Get the path of the current folder
BASE_DIR = Path(__file__).resolve().parent

# Path to the SQLite database file
DB_PATH = BASE_DIR / "translations.db"


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection

def initialize_database():
    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS translations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_text TEXT NOT NULL,
            translated_text TEXT NOT NULL,
            source_language TEXT NOT NULL,
            target_language TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    connection.commit()
    connection.close()

def save_translation(
    source_text,
    translated_text,
    source_language,
    target_language
):
    connection = get_connection()

    connection.execute(
        """
        INSERT INTO translations (
            source_text,
            translated_text,
            source_language,
            target_language
        )
        VALUES (?, ?, ?, ?)
        """,
        (
            source_text,
            translated_text,
            source_language,
            target_language
        )
    )

    connection.commit()
    connection.close()

def get_translation_history():
    connection = get_connection()

    cursor = connection.execute("""
        SELECT *
        FROM translations
        ORDER BY created_at DESC
    """)

    rows = cursor.fetchall()

    connection.close()

    return [dict(row) for row in rows]