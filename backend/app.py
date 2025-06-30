from flask import Flask, jsonify, request
from flask_cors import CORS
from models import get_sales_data, get_weather_data
from populate_db import populate_database
import os

app = Flask(__name__)
CORS(app)  # Permitir conexión con React

# Agregar al inicio de las rutas
@app.route('/')
def home():
    return jsonify({
        "message": "Bienvenido a la API de Ventas y Colorimetría",
        "endpoints": {
            "sales": "/api/sales",
            "weather": "/api/weather?city={city}",
            "color_analysis": "/api/color (POST)"
        }
    })

# Ruta para obtener datos de ventas
@app.route('/api/sales', methods=['GET'])
def sales():
    try:
        data = get_sales_data()
        return jsonify({
            "status": "success",
            "count": len(data),
            "sales": data
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Ruta para obtener clima (usando OpenWeather API)
@app.route('/api/weather', methods=['GET'])
def weather():
    city = request.args.get('city', 'Madrid')
    data = get_weather_data(city)
    return jsonify(data)

# Nueva ruta para guardar análisis de color
@app.route('/api/color', methods=['POST'])
def save_color():
    data = request.json
    client_id = data.get('client_id')
    color_data = data.get('color_data')
    
    try:
        save_color_analysis(client_id, color_data)
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Nueva ruta para poblar la base de datos
@app.route('/api/populate', methods=['POST'])
def populate_db():
    try:
        users_count, products_count, clients_count = populate_database()
        return jsonify({
            "status": "success",
            "message": "Base de datos poblada con datos de prueba",
            "users_added": users_count,
            "products_added": products_count,
            "clients_added": clients_count
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Solo para desarrollo: servir archivos estáticos del frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join('../frontend/build', path)):
        return send_from_directory('../frontend/build', path)
    else:
        return send_from_directory('../frontend/build', 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)