let totalPrice = 0;
let code = "";
let reading = false;
const barcodeZone = document.getElementById('barcodeZone');
let actualItems = [];
let categoriesDictionary = new Map();

async function fetchGetUrl(url) {
  try {
      const response = await fetch(url);
      console.log(response)
      if (!response.ok) {
        alert("No se ha podido realizar la operación"); 
      }
      const json = await response.json(); 
      if(json==null){
        throw new Error('Este objeto no se encuentra registrado');
      }
      return json;
  } catch (error) {
      alert(error.message); 
  }
}

fetchGetUrl('http://localhost:25565/kiosco/category/').then(  categories => {
  categories.forEach(element => {
    categoriesDictionary.set(element.id, element.name); 
  })});
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
  let objects = ``
  let frequencies = {};
  actualItems.sort()
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
      <td>${frequencies[item.id]}</td>
      </tr>`
  });
  const templateItems = `
  <div>
  <table>
  <tr>
  <th>NOMBRE</th>
  <th>PRECIO</th>
  <th>CATEGORIA</th>
  <th>CANTIDAD</th>
  `+ objects + `
  </tr>
  <tr><th></th><th>${totalPrice}</th></tr>
  </table>
  
  </div>
  `
  zone.innerHTML = templateItems;
}
