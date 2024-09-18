let code = "";
let reading = false;
let categoriesDictionary = new Map();
const idContainer = document.getElementById('itemId');
const nameContainer = document.getElementById('itemName');
const priceContainer = document.getElementById('itemPrice');
const categoryContainer = document.getElementById('itemCategory');
const itemContainer = document.getElementById('items-container');
const audio = new Audio('../sounds/success_sound.mp3'); 


function attachTableSorting() {
    const table = document.getElementById('itemsTable');
    if (!table) return;

    const headers = table.querySelectorAll('th');
    let sortOrder = 'asc'; // O 'desc'

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            sortTable(column, sortOrder);
            sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            updateSortIcons(header, sortOrder);
        });
    });

    function sortTable(column, order) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const index = Array.from(headers).findIndex(header => header.dataset.column === column);

        rows.sort((a, b) => {
            const aText = a.children[index].innerText.trim();
            const bText = b.children[index].innerText.trim();

            if (column === 'price') {
                return (order === 'asc' ? parseFloat(aText) - parseFloat(bText) : parseFloat(bText) - parseFloat(aText));
            }
            if (column === 'id') {
                return (order === 'asc' ? parseFloat(aText) - parseFloat(bText) : parseFloat(bText) - parseFloat(aText));
            }

            return (order === 'asc' ? aText.localeCompare(bText) : bText.localeCompare(aText));
        });

        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));
    }

    function updateSortIcons(activeHeader, order) {
        headers.forEach(header => {
            header.classList.remove('sorted-asc', 'sorted-desc');
            if (header === activeHeader) {
                header.classList.add(order === 'asc' ? 'sorted-asc' : 'sorted-desc');
            }
        });
    }
}




function playSuccessSound() {
    audio.play();
  }
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
                <th data-column="name">Nombre</th>
                <th data-column="price">Precio</th>
                <th data-column="category">Categoría</th>
                <th data-column="actions"></th>
            </tr>
        </thead>
        <tbody>`;
    fetchGetUrl('https://zombiesurvive.ddns.net:8444/kiosco/item/')
        .then(items => {
            items.forEach(item => {
                itemsHtml += `<tr data-id="${item.id}">
                <td>${item.id}</td>
                <td>${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</td>
                <td>${item.price.toFixed(2)}€</td>
                <td>${categoriesDictionary.get(item.categoryId).toUpperCase()}</td>
                <td>
                    <button id="deleteButton" onClick="deleteItem(${item.id})">✖</button>
                    <button id="updateButton" onClick="updateItem(${item.id})">✏️</button>
                </td>
              </tr>`;
            });
            itemsHtml += '</tbody></table>';
            itemContainer.innerHTML = itemsHtml;
            attachTableSorting(); // Asignar eventos de ordenación después de cargar la tabla
        })
        .catch(error => {
            console.error('Error fetching items:', error);
        });
}


fetchGetUrl('https://zombiesurvive.ddns.net:8444/kiosco/category/').then(categories => {
    categories.forEach(element => {
      categoriesDictionary.set(element.id, element.name); 
    });
    let categoriesSelects = '<option value="-1">--Selecciona una categoria--</option>';
    categoriesDictionary.forEach((value, key) => {
        categoriesSelects += `<option value="${key}">${value.charAt(0).toUpperCase() + value.slice(1)}</option>`;
      });
    categoryContainer.innerHTML = categoriesSelects;
  });
  reloadItems();

  async function deleteItem(itemId) {
    const url = `https://zombiesurvive.ddns.net:8444/kiosco/item/${itemId}`;
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

function updateItem(itemId) {
    // Seleccionar la fila que contiene el itemId usando el atributo data-id
    const row = document.querySelector(`tr[data-id='${itemId}']`);
    
    // Obtener los valores actuales de la fila
    const id = row.children[0].innerText;
    const name = row.children[1].innerText;
    const price = row.children[2].innerText.replace('€', '');
    const category = row.children[3].innerText;

    // Reemplazar la fila por un formulario de edición
    row.innerHTML = `
        <td>${id}</td>
        <td><input type="text" id="updateName" value="${name}" /></td>
        <td><input type="number" id="updatePrice" value="${price}" step="0.01" /></td>
        <td>
            <select id="updateCategory">
                ${Array.from(categoriesDictionary).map(([key, value]) => 
                    `<option value="${key}" ${value.toUpperCase() === category ? 'selected' : ''}>
                        ${value.charAt(0).toUpperCase() + value.slice(1)}
                    </option>`
                ).join('')}
            </select>
        </td>
        <td>
            <button id="completeButton" onClick="completeUpdate(${id})">✔️</button>
        </td>
    `;
}


async function completeUpdate(itemId) {
    const name = document.getElementById('updateName').value;
    const price = parseFloat(document.getElementById('updatePrice').value);
    const categoryId = parseInt(document.getElementById('updateCategory').value);

    if (!name || price <= 0 || categoryId === -1) {
        alert('Por favor, complete todos los campos correctamente.');
        return;
    }

    try {
        const response = await fetch(`https://zombiesurvive.ddns.net:8444/kiosco/item/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: itemId,
                name: name,
                price: price,
                categoryId: categoryId
            })
        });

        if (!response.ok) {
            throw new Error('No se ha podido actualizar el item');
        }

        // Actualizar la tabla y ocultar el formulario
        reloadItems();
    } catch (error) {
        console.error('Error:', error);
        alert('No se ha podido actualizar el item');
    }
}

  function showCreateItem(id) {
    const createItemContainer = document.getElementById('createItem-container');
    const overlay = document.getElementById('overlay');
    if (id!=null) {
    idContainer.value = id;
    idContainer.readOnly=true;
    }
    createItemContainer.classList.add('visible');
    overlay.classList.add('visible');
}

// Oculta el contenedor y elimina el efecto de fondo difuminado
function hideCreateItem() {
    const createItemContainer = document.getElementById('createItem-container');
    const overlay = document.getElementById('overlay');
    createItemContainer.classList.remove('visible');
    overlay.classList.remove('visible');
    idContainer.readOnly=false;
    idContainer.value = null;
    nameContainer.value = null;
    priceContainer.value = null;
    categoryContainer.value = -1;
}

function postNewItem() {
    // Devuelve la promesa del fetch para manejar la respuesta en createItem
    return fetch('https://zombiesurvive.ddns.net:8444/kiosco/item/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: idContainer.value,
            name: nameContainer.value,
            price: parseFloat(priceContainer.value), // Asegúrate de que el precio sea un número
            categoryId: parseInt(categoryContainer.value) // Asegúrate de que la categoría sea un número
        })
    });
}

async function createItem() {
    if (idContainer.value == null || idContainer.value === "") {
        alert('El identificador no puede ser vacío');
        return;
    }
    
    if (nameContainer.value == null || nameContainer.value === "") {
        alert('Debes ingresar un nombre');
        return;
    }
    
    if (priceContainer.value <= 0) {
        alert('Debes ingresar un precio mayor a 0');
        return;
    }

    if (categoryContainer.value == -1) {
        alert('Debes seleccionar una categoría');
        return;
    }

    // Verifica si el item ya existe
    try {
        const existingItem = await fetchGetUrl(`https://zombiesurvive.ddns.net:8444/kiosco/item/${idContainer.value}`);
        if (existingItem != null) {
            alert('El código ya existe');
            return;
        }
    } catch (error) {
        console.error('Error fetching item:', error);
        return;
    }

    try {
        const response = await postNewItem();
        if (!response.ok) {
            throw new Error('No se ha podido crear el item');
        }
        hideCreateItem();
        playSuccessSound();
        reloadItems();
    } catch (error) {
        console.error('Error:', error);
        alert('No se ha podido crear el item');
    }
}


document.addEventListener('keypress', async e => {
    if (e.keyCode === 13) {
        if (code.length > 7) {
            showCreateItem(code); // Muestra el contenedor cuando se cumple la condición
            code = "";
        }
    } else {
        code += e.key; 
    }

    if (!reading) {
        reading = true;
        setTimeout(() => {
            code = "";
            reading = false;
        }, 300); 
    }
});



