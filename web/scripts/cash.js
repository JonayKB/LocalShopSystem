const tradeContent = document.getElementById('items-container');
const sendButton = document.getElementById('sendButton');
let categoriesDictionary = new Map();

async function fetchGetUrl(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        alert("No se ha podido realizar la operación"); 
      }
      const json = await response.json(); 
      if(json == null) {
        throw new Error('Este objeto no se encuentra registrado');
      }
      return json;
    } catch (error) {
      alert(error.message); 
    }
}

function displayTrades() {
    let totalPrice = 0;
    let startDateContent = document.getElementById('datetime-start');
    let endDateContent = document.getElementById('datetime-end');
    let startDate = new Date(startDateContent.value);
    let endDate = new Date(endDateContent.value);
    let now = new Date();
    
    if (startDateContent.value != ''){
        startDate = new Date(startDateContent.value);
        console.log(startDateContent.value);
    } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 1, 0, 0);
    }

    if (endDateContent.value != ''){
        endDate = new Date(endDateContent.value);
    } else {
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0);
    }

    // Construye la URL con los parámetros de fecha
    let url = `https://localhost:8444/kiosco/trade/range?startDate=${encodeURIComponent(startDate.toISOString())}&endDate=${encodeURIComponent(endDate.toISOString())}`;

    // Realiza la solicitud fetch
    fetch(url)
        .then(response => response.json())
        .then(trades => {
            let itemQuantities = new Map(); // Mapa para contar las cantidades de cada ítem
            let categoryPriceMap = new Map();
            let uniqueItems = new Map(); // Mapa para almacenar ítems únicos

            trades.forEach(trade => {
                trade.items.forEach(item => {
                    totalPrice += item.price;
                    

                    // Contar las cantidades de cada ítem
                    const currentQuantity = itemQuantities.get(item.id) || 0;
                    itemQuantities.set(item.id, currentQuantity + 1);

                    const currentCategoryTotal = categoryPriceMap.get(item.categoryId) || 0;

                    // Actualiza el mapa con el nuevo total de la categoría
                    categoryPriceMap.set(item.categoryId, currentCategoryTotal + item.price);

                    // Almacenar ítems únicos
                    if (!uniqueItems.has(item.id)) {
                        uniqueItems.set(item.id, item);  // Añadir el ítem si no está ya en el mapa
                    }
                });
            });

            // Construir la tabla con cantidades de ítems únicos
            let contentInfo = `<table id="itemsTable" class="centered-table">
                <thead>
                    <tr>
                        <th data-column="id">Identificador</th>
                        <th data-column="name">Nombre</th>
                        <th data-column="price">Precio</th>
                        <th data-column="category">Categoría</th>
                        <th data-column="quantity">Cantidad</th>
                    </tr>
                </thead>
                <tbody>`;

            uniqueItems.forEach((item, id) => {
                contentInfo += `<tr data-id="${id}">
                    <td>${id}</td>
                    <td>${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</td>
                    <td>${item.price.toFixed(2)}€</td>
                    <td>${categoriesDictionary.get(item.categoryId).toUpperCase()}</td>
                    <td>${itemQuantities.get(id)}</td>
                    </tr>`;
            });

            contentInfo += `<tr><td>TOTAL:</td><td></td><td>${totalPrice.toFixed(2)}€</td><td></td><td></td></tr></tbody></table><br><br><br>
            <table id="itemsTable" class="centered-table">
                <thead>
                    <tr>
                        <th data-column="categoryPrice">Categoría</th>
                        <th data-column="pricePerCategory">Precio</th>
                    </tr>
                </thead>
                <tbody>
            `;

            // Agregar los totales por categoría a la tabla
            categoryPriceMap.forEach((value, key) => {
                contentInfo += `<tr>
                <td>${categoriesDictionary.get(key).toUpperCase()}</td>
                <td>${value.toFixed(2)}€</td>
                </tr>`;
            });

            contentInfo += `</tbody></table>`;

            // Renderizar el contenido en el contenedor
            tradeContent.innerHTML = contentInfo;
        })
        .catch(error => {
            console.error('Error fetching trades:', error);
        });
}

function downloadReport(){
    // URL de la API que devuelve el archivo
const apiUrl = 'https://localhost:8444/kiosco/generate-report';

fetch(apiUrl)
    .then(response => {
        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob(); // Convertir la respuesta a un Blob
    })
    .then(blob => {
        // Crear una URL para el Blob
        const url = URL.createObjectURL(blob);

        // Crear un enlace para descargar el archivo
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_trades.xlsx'; // Nombre del archivo descargado
        document.body.appendChild(a); // Necesario para Firefox
        a.click(); // Simular el clic en el enlace para iniciar la descarga

        // Limpiar
        a.remove(); // Eliminar el enlace del DOM
        URL.revokeObjectURL(url); // Liberar la URL del Blob
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

}

// Cargar categorías y construir el diccionario
fetchGetUrl('https://localhost:8444/kiosco/category/').then(categories => {
    categories.forEach(element => {
        categoriesDictionary.set(element.id, element.name); 
    });
});
