import psycopg2
import os
import requests

def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            port=5432
        )
        print("✅ Conexión a PostgreSQL exitosa")
        return conn
    except Exception as e:
        print(f"❌ Error conectando a PostgreSQL: {e}")
        raise

def get_sales_data():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('''
            SELECT v.id, v.fecha, v.total, 
                   c.nombre AS cliente_nombre,
                   p.nombre AS producto_nombre
            FROM ventas v
            JOIN clientes c ON v.cliente_id = c.id
            JOIN detalles_venta dv ON v.id = dv.venta_id
            JOIN productos p ON dv.producto_id = p.id
            ORDER BY v.fecha DESC 
            LIMIT 10
        ''')
        
        # Obtener nombres de columnas
        column_names = [desc[0] for desc in cur.description]
        
        # Crear lista de diccionarios
        sales = []
        for row in cur.fetchall():
            sales.append(dict(zip(column_names, row)))
        
        cur.close()
        conn.close()
        return sales
    except Exception as e:
        print(f"Error getting sales data: {e}")
        return []
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