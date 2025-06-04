import psycopg2
import os
import requests

def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),  # IP de tu EC2
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD')
    )
    return conn

def get_sales_data():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM ventas ORDER BY fecha DESC LIMIT 10')
    sales = cur.fetchall()
    cur.close()
    conn.close()
    return sales

def get_weather_data(city):
    API_KEY = os.getenv('WEATHER_API_KEY')
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric'
    response = requests.get(url)
    return response.json()

def save_color_analysis(client_id, color_data):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO colorimetrias (cliente_id, tono_piel, color_cabello, colores_recomendados) VALUES (%s, %s, %s, %s)",
        (client_id, color_data.get('skin_tone'), color_data.get('hair_color'), color_data.get('recommended_colors'))
    )
    conn.commit()
    cur.close()
    conn.close()