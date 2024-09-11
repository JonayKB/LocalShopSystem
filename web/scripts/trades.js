const itemContainer = document.getElementById('items-container');
let categoriesDictionary = new Map();
async function fetchGetUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            alert("No se ha podido realizar la operación");
        }
        const json = await response.json();
        return json;
    } catch (error) {
        alert(error.message);
    }
}

function reloadItems() {
    let itemsHtml = `<table id="itemsTable">
        <thead>
            <tr>
                <th data-column="id">Identificador</th>
                <th data-column="date">Fecha</th>
                <th data-column="time">Hora</th>
                <th data-column="actions"></th>
            </tr>
        </thead>
        <tbody>`;

    fetchGetUrl('https://zombiesurvive.ddns.net:8444/kiosco/trade/')
        .then(items => {
            items.forEach(item => {
                let date = new Date(item.date);
                itemsHtml += `<tr data-id="${item.id}" class="accordion-button">
                <td>${item.id}</td>
                <td>${date.toLocaleDateString()}</td>
                <td>${date.toLocaleTimeString()}</td>
                <td>
                    <button id="deleteButton" onClick="deleteItem(${item.id})">✖</button>
                </td>
              </tr>
              <tr>
                <td colspan="4" class="accordion-td">
                    <div class="accordion-content">Cargando detalles...</div>
                </td>
              </tr>`;
            });
            itemsHtml += '</tbody></table>';
            itemContainer.innerHTML = itemsHtml;

            // Asigna los event listeners después de que el DOM esté actualizado
            let accordionButtons = document.querySelectorAll('.accordion-button');
            accordionButtons.forEach(button => {
                button.addEventListener('click', function () {
                    let nextRow = this.nextElementSibling;
                    let accordionContent = nextRow.querySelector('.accordion-content');

                    if (accordionContent.innerHTML === 'Cargando detalles...') {
                        let tradeId = this.getAttribute('data-id');
                        fetchGetUrl(`https://zombiesurvive.ddns.net:8444/kiosco/item/byTrade/${tradeId}`)
                            .then(itemDetails => {
                                let contentObject = `<table>
                                    <thead>
                                        <tr>
                                            <th data-column="id">Identificador</th>
                                            <th data-column="name">Nombre</th>
                                            <th data-column="price">Precio</th>
                                            <th data-column="category">Categoría</th>
                                        </tr>
                                    </thead>
                                    <tbody>`;
                                
                                itemDetails.forEach(actualItem => {
                                    contentObject += `<tr data-id="${actualItem.id}">
                                        <td>${actualItem.id}</td>
                                        <td>${actualItem.name.charAt(0).toUpperCase() + actualItem.name.slice(1)}</td>
                                        <td>${actualItem.price.toFixed(2)}€</td>
                                        <td>${categoriesDictionary.get(actualItem.categoryId).toUpperCase()}</td>
                                    </tr>`;
                                });
                                
                                contentObject += '</tbody></table>';
                                accordionContent.innerHTML = contentObject;
                                accordionContent.classList.add('show'); // Muestra el contenido
                            })
                            .catch(error => {
                                console.error('Error fetching item details:', error);
                                accordionContent.innerHTML = 'Error al cargar detalles';
                            });
                    } else {
                        accordionContent.classList.toggle('show'); // Alterna la visibilidad del contenido
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error fetching items:', error);
        });
}






async function deleteItem(itemId) {
    const url = `https://zombiesurvive.ddns.net:8444/kiosco/trade/${itemId}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        });

        console.log(response.status);

        if (response.ok) {
            if (response.status === 204) {
                console.log('Item deleted successfully');
            } else {
                const json = await response.json();
                console.log(json);
            }
        } else {
            console.error('Error deleting item');
        }

        reloadItems();
    } catch (error) {
        alert(error.message);
    }
}

// Cargar los items al inicio
reloadItems();
fetchGetUrl('https://zombiesurvive.ddns.net:8444/kiosco/category/').then(categories => {
    categories.forEach(element => {
      categoriesDictionary.set(element.id, element.name); 
    });
  });