import mysql.connector
from mysql.connector import Error

def get_connection():
    return mysql.connector.connect(
        host='175.126.37.21',
        port='13306',
        database='db235',
        user='id235',
        password='pw235'
    )

def get_all_titles():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT book_name FROM item_book")
    titles = [row[0] for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return titles

def get_all_authors():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT writer FROM item_book")
    authors = [row[0] for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return authors

def get_all_genres():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT genre_name FROM genre")
    genres = [row[0] for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return genres


def search_book(title=None, author=None, genre=None):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT ib.*, g.genre_name
        FROM item_book ib
        LEFT JOIN genre g ON ib.gno = g.no
        WHERE 1=1
    """
    params = []

    if title:
        query += " AND ib.book_name = %s"
        params.append(title)
    if author:
        query += " AND ib.writer = %s"
        params.append(author)
    if genre:
        query += " AND g.genre_name = %s"
        params.append(genre)

    cursor.execute(query, tuple(params))
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return results