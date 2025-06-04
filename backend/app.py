from flask import Flask, jsonify, request
from flask_cors import CORS
from models import get_sales_data, get_weather_data
import os

app = Flask(__name__)
CORS(app)  # Permitir conexión con React

# Ruta para obtener datos de ventas
@app.route('/api/sales', methods=['GET'])
def sales():
    data = get_sales_data()
    return jsonify(data)

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)