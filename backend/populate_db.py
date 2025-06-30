import requests
import psycopg2
import os
import random
from datetime import datetime, timedelta
from models import get_db_connection

# Obtener productos de Fake Store API
def get_fake_products():
    response = requests.get('https://fakestoreapi.com/products')
    if response.status_code == 200:
        return response.json()
    return []

# Obtener usuarios de Fake Store API
def get_fake_users():
    response = requests.get('https://fakestoreapi.com/users')
    if response.status_code == 200:
        return response.json()
    return []

# Obtener personajes de Rick and Morty API
def get_rick_and_morty_characters():
    characters = []
    page = 1
    while len(characters) < 20:  # Obtener 20 personajes
        response = requests.get(f'https://rickandmortyapi.com/api/character?page={page}')
        if response.status_code == 200:
            data = response.json()
            characters.extend(data['results'])
            page += 1
            if page > data['info']['pages']:
                break
        else:
            break
    return characters

# Insertar datos en la base de datos
def populate_database():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Limpiar tablas existentes
    cur.execute("DELETE FROM detalles_venta")
    cur.execute("DELETE FROM ventas")
    cur.execute("DELETE FROM productos")
    cur.execute("DELETE FROM clientes")
    cur.execute("DELETE FROM usuarios")
    cur.execute("DELETE FROM colorimetrias")
    
    # Insertar usuarios
    fake_users = get_fake_users()
    for user in fake_users:
        cur.execute(
            "INSERT INTO usuarios (nombre, email, password, rol) VALUES (%s, %s, %s, %s)",
            (f"{user['name']['firstname']} {user['name']['lastname']}", 
             user['email'], 
             user['password'], 
             'cliente')
        )
    
    # Insertar clientes con datos de Rick and Morty
    characters = get_rick_and_morty_characters()
    for i, character in enumerate(characters):
        cur.execute(
            "INSERT INTO clientes (nombre, correo, direccion) VALUES (%s, %s, %s)",
            (character['name'], 
             f"{character['name'].replace(' ', '').lower()}@example.com", 
             f"{character['location']['name']}, {character['origin']['name']}")
        )
    
    # Insertar productos
    products = get_fake_products()
    for product in products:
        cur.execute(
            "INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (%s, %s, %s, %s)",
            (product['title'], 
             product['description'], 
             product['price'], 
             random.randint(10, 100))
        )
    
    # Insertar ventas y detalles
    cur.execute("SELECT id FROM clientes")
    client_ids = [row[0] for row in cur.fetchall()]
    
    cur.execute("SELECT id, precio FROM productos")
    products_data = cur.fetchall()
    
    for i in range(50):  # Crear 50 ventas
        client_id = random.choice(client_ids)
        sale_date = datetime.now() - timedelta(days=random.randint(1, 365))
        
        cur.execute(
            "INSERT INTO ventas (cliente_id, fecha, total) VALUES (%s, %s, %s) RETURNING id",
            (client_id, sale_date, 0)
        )
        sale_id = cur.fetchone()[0]
        
        total = 0
        # Agregar 1-5 productos por venta
        for _ in range(random.randint(1, 5)):
            product_id, price = random.choice(products_data)
            quantity = random.randint(1, 3)
            subtotal = price * quantity
            total += subtotal
            
            cur.execute(
                "INSERT INTO detalles_venta (venta_id, producto_id, cantidad, precio_unitario) VALUES (%s, %s, %s, %s)",
                (sale_id, product_id, quantity, price)
            )
        
        # Actualizar el total de la venta
        cur.execute(
            "UPDATE ventas SET total = %s WHERE id = %s",
            (round(total, 2), sale_id)
        )
    
    conn.commit()
    cur.close()
    conn.close()
    return len(fake_users), len(products), len(client_ids)

if __name__ == '__main__':
    users_count, products_count, clients_count = populate_database()
    print(f"Base de datos poblada con éxito: {users_count} usuarios, {products_count} productos, {clients_count} clientes")