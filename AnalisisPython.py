import requests
import pandas as pd
from dateutil import parser
import plotly.express as px

# URL de la API (cambia esta URL a la de tu API real)
url = 'https://localhost:8444/kiosco/trade/'

# Hacer la petición GET a la API deshabilitando la verificación SSL
response = requests.get(url, verify=False)

# Verificar si la petición fue exitosa
if response.status_code == 200:
    # Obtener los datos en formato JSON
    data = response.json()
    
    # Lista para almacenar los datos extraídos
    trades_list = []

    # Recorrer cada trade y extraer la fecha y los items
    for trade in data:
        # Usar parser de dateutil para interpretar correctamente la fecha
        fecha = parser.isoparse(trade['date'])
        fecha_sin_hora = fecha.date()
        hora = fecha.hour
        
        # Recorrer los items de cada trade
        for item in trade['items']:
            trades_list.append({
                'fecha': fecha_sin_hora,  # Fecha sin hora
                'hora': hora,             # Hora del día
                'id': item['id'],
                'nombre': item['name'],
                'precio': item['price'],
                'categoryId': item['categoryId']
            })

    # Crear DataFrame con los datos extraídos
    df = pd.DataFrame(trades_list)

    # Visualizar los primeros registros del DataFrame
    print(df.head())

    # Crear un DataFrame que cuente la cantidad de productos vendidos por día y producto
    df_dia = df.groupby(['fecha', 'id', 'nombre']).size().reset_index(name='cantidad')

    # Ordenar DataFrames por fecha y cantidad/precio
    df_dia_sorted = df_dia.sort_values(by=['fecha', 'cantidad'], ascending=[True, False])

    # Crear un gráfico interactivo de productos más vendidos por día
    fig_dia = px.bar(df_dia_sorted, 
                     x='fecha', 
                     y='cantidad', 
                     color='nombre',  # Asegúrate de usar el nombre correcto del campo
                     title='Productos más vendidos por día',
                     labels={'fecha': 'Fecha', 'cantidad': 'Cantidad'},
                     hover_data=['id', 'nombre'])

    fig_dia.update_layout(xaxis_title='Fecha', yaxis_title='Cantidad')
    fig_dia.update_xaxes(tickangle=45)  # Rotar etiquetas del eje x

    # Guardar el gráfico de productos más vendidos como archivo HTML

    # Crear un DataFrame que cuente la cantidad de productos vendidos por hora del día
    df_horas = df.groupby(['fecha', 'hora']).size().reset_index(name='cantidad')

    # Ordenar DataFrame por fecha y hora
    df_horas_sorted = df_horas.sort_values(by=['fecha', 'hora'], ascending=[True, True])

    # Crear un gráfico interactivo de productos vendidos por hora del día
    fig_horas = px.line(df_horas_sorted,
                        x='hora',
                        y='cantidad',
                        color='fecha',
                        title='Cantidad de productos vendidos por hora del día',
                        labels={'hora': 'Hora del Día', 'cantidad': 'Cantidad'},
                        markers=True)

    fig_horas.update_layout(xaxis_title='Hora del Día', yaxis_title='Cantidad')
    fig_horas.update_xaxes(dtick=1)  # Mostrar cada hora en el eje x

    # Guardar el gráfico de productos vendidos por hora como archivo HTML
    fig_dia.write_html('C:/xampp2/htdocs/localsystem/pages/productos_mas_vendidos.html')
    fig_horas.write_html('C:/xampp2/htdocs/localsystem/pages/productos_vendidos_por_hora.html')


else:
    # Manejar el error si la petición falla
    print(f"Error al hacer la request: {response.status_code}")
