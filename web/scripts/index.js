let totalPrice = 0;
let code = "";
let reading = false;
const barcodeZone = document.getElementById('barcodeZone');
let actualItems = [];
let categoriesDictionary = new Map();
const sendButton = document.getElementById('sendButton');

async function fetchGetUrl(url) {
  try {
    const response = await fetch(url);
    console.log(response);
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
});

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
        <button onclick="deleteItem(${item.id})">-</button> 
        ${frequencies[item.id]} 
        <button onclick="addItem(${item.id})">+</button>
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
  console.log(JSON.stringify(actualItems));
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
      console.log('Success:', data);
      actualItems = [];
      totalPrice = 0;
      displayItems(actualItems, barcodeZone);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Ocurrió un error al enviar la solicitud. Ver consola para más detalles.');
    });
}


sendButton.onclick = sendTrade;
