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
            </tr>
        </thead>
        <tbody>`;
    fetchGetUrl('https://zombiesurvive.ddns.net:8444/kiosco/item/')
        .then(items => {
            items.forEach(item => {
                itemsHtml += `<tr>
                                <td>${item.id}</td>
                                <td>${item.name}</td>
                                <td>${item.price}€</td>
                                <td>${categoriesDictionary.get(item.categoryId).toUpperCase()}</td>
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
        categoriesSelects += `<option value="${key}">${value.toUpperCase()}</option>`;
      });
    categoryContainer.innerHTML = categoriesSelects;
  });
  reloadItems();
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
        if (code.length > 10) {
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
        }, 100); 
    }
});



