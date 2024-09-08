let totalPrice = 0;
let code = "";
let reading = false;
const barcodeZone = document.getElementById('barcodeZone');
const selectorZone = document.getElementById('selector');
let actualItems = [];
let categoriesDictionary = new Map();
const sendButton = document.getElementById('sendButton');
let returnButton = document.getElementById('returnButton');

function playSuccessSound() {
  const audio = new Audio('../web/sounds/success_sound.mp3'); 
  audio.play();
}
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

fetchGetUrl('http://localhost:25565/kiosco/category/').then(categories => {
  categories.forEach(element => {
    categoriesDictionary.set(element.id, element.name); 
  });
  selectorInitiator();
});

function selectorInitiator(){
  let content = '';
  categoriesDictionary.forEach((value, key) => {
    content += `<div id="category${key}" class="category-item" data-id="${key}">
                  <img src="../web/images/categories/${key}.jpg" data-id="${key}"  />
                 <h3 data-id="${key}" >${value.toUpperCase()}</h3>
                </div>`;
  });
  selectorZone.innerHTML = content;

  document.querySelectorAll('.category-item').forEach(img => {
    img.addEventListener('click', event => {
      const categoryId = event.target.getAttribute('data-id');
      loadCategoryContent(categoryId); 
    });
  });
}
function loadCategoryContent(categoryId) {
  fetchGetUrl(`http://localhost:25565/kiosco/item/byCategory/${categoryId}`)
    .then(objects => {
      let content = '';
      objects.forEach(item => {
        content += `<div class="object-item" data-id="${item.id}">
          <img src="../web/images/items/${item.id}.jpg" alt="${item.name}" data-id="${item.id}" />
          <h3 data-id="${item.id}">${item.name}</h3>
        </div>`;
      });
      content += `<button id="returnButton">Volver</button>`;
      
      // Actualizar el contenido del selector con los ítems de la categoría seleccionada
      selectorZone.innerHTML = content;

      // Asignar el evento para el botón de "Volver"
      const returnButton = document.getElementById('returnButton');
      if (returnButton) {
        returnButton.onclick = selectorInitiator;
      }

      // Aquí es donde se debe asignar el evento `click` a las imágenes
      document.querySelectorAll('.object-item').forEach(img => {
        img.addEventListener('click', event => {
          const itemId = event.target.getAttribute('data-id');
          fetchGetUrl(`http://localhost:25565/kiosco/item/${itemId}`)
            .then(item => {
              actualItems.push(item); // Añadir el ítem a la lista actual
              totalPrice += item.price; // Sumar el precio al total
              displayItems(actualItems, barcodeZone); // Actualizar la visualización de la lista de ítems
            });
        });
      });
    });
}



document.addEventListener('keypress', async e => {
  if (e.keyCode === 13) {
    if (code.length > 10) {
      let url = "http://localhost:25565/kiosco/item/" + code;
      const jsonData = await fetchGetUrl(url);
      actualItems.push(jsonData);
      totalPrice += jsonData.price;
      displayItems(actualItems, barcodeZone); 
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

function displayItems(actualItems, zone) {
  let objects = ``;
  let frequencies = {};
  actualItems.sort();
  
  actualItems.forEach(item => {
    if (frequencies[item.id]) {
      frequencies[item.id] += 1; // Increment the count if item already exists in the dictionary
    } else {
      frequencies[item.id] = 1; // Initialize the count to 1 if the item is new
    }
  });

  const uniqueItems = Array.from(new Set(actualItems.map(item => item.id)))
    .map(id => {
      return actualItems.find(item => item.id === id);
    });

  uniqueItems.forEach(item => {
    objects += `<tr>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${categoriesDictionary.get(item.categoryId)}</td>
      <td>
        <button onclick="deleteItem(${item.id})" class= "quantity-button">-</button> 
        ${frequencies[item.id]} 
        <button onclick="addItem(${item.id})" class= "quantity-button">+</button>
      </td>
      </tr>`;
  });

  const templateItems = `
  <div>
    <table>
      <tr>
        <th>NOMBRE</th>
        <th>PRECIO</th>
        <th>CATEGORIA</th>
        <th>CANTIDAD</th>
      </tr>
      ${objects}
      <tr><th>TOTAL</th><th>${totalPrice.toFixed(2)}</th></tr>
    </table>
  </div>
  `;
  
  zone.innerHTML = templateItems;
}

function addItem(itemId) {
  // Find the item by itemId
  const item = actualItems.find(i => i.id === itemId);
  // Add item to the actualItems array and update the total price
  if (item) {
    totalPrice += item.price;
    actualItems.push(item);
    displayItems(actualItems, barcodeZone);
  }
}

function deleteItem(itemId) {
  // Find the item by itemId
  const itemIndex = actualItems.findIndex(i => i.id === itemId);
  // Remove item from actualItems array and update the total price
  if (itemIndex !== -1) {
    totalPrice -= actualItems[itemIndex].price;
    actualItems.splice(itemIndex, 1); // Remove one instance of the item
    displayItems(actualItems, barcodeZone);
  }
}

function sendTrade() {
  if (actualItems.length === 0) {
    alert("No hay productos añadidos");
    return;
  }
  fetch('http://localhost:25565/kiosco/trade/newTrade', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Aquí puedes agregar otros encabezados si es necesario, como Authorization
    },
    body: JSON.stringify(actualItems)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      actualItems = [];
      totalPrice = 0;
      displayItems(actualItems, barcodeZone);
      playSuccessSound();
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Ocurrió un error al enviar la solicitud. Ver consola para más detalles.');
    });
}


sendButton.onclick = sendTrade;
