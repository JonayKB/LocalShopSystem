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
    console.log(startDateContent.value)
}
else{
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,1 , 0, 0);
}
    if (endDateContent.value!= ''){
    endDate = new Date(endDateContent.value);
}else{
    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0);

}
    

    // Construye la URL con los parámetros de fecha
    let url = `https://zombiesurvive.ddns.net:8444/kiosco/trade/range?startDate=${encodeURIComponent(startDate.toISOString())}&endDate=${encodeURIComponent(endDate.toISOString())}`;
    // Realiza la solicitud fetch
    fetch(url)
        .then(response => response.json())
        .then(trades => {
            let categoryPriceMap = new Map();
            let contentInfo = `<table id="itemsTable" class="centered-table">
                <thead>
                    <tr>
                        <th data-column="id">Identificador</th>
                        <th data-column="name">Nombre</th>
                        <th data-column="price">Precio</th>
                        <th data-column="category">Categoría</th>
                    </tr>
                </thead>
                <tbody>`;

            trades.forEach(trade => {
                trade.items.forEach(item => {
                    totalPrice += item.price;
                    const currentCategoryTotal = categoryPriceMap.get(item.categoryId) || 0;

                    // Actualiza el mapa con el nuevo total de la categoría
                    categoryPriceMap.set(item.categoryId, currentCategoryTotal + item.price);
                    contentInfo += `<tr data-id="${item.id}">
                    <td>${item.id}</td>
                    <td>${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</td>
                    <td>${item.price.toFixed(2)}€</td>
                    <td>${categoriesDictionary.get(item.categoryId).toUpperCase()}</td></tr>`;
                });
            });

            contentInfo += `<tr><td>TOTAL:</td><td></td><td>${totalPrice.toFixed(2)}€</td></tr></tbody></table><br><br><br>
            <table id="itemsTable" class="centered-table">
                <thead>
                    <tr>
                        <th data-column="categoryPrice">Categoría</th>
                        <th data-column="pricePerCategory">Precio</th>
                    </tr>
                </thead>
                <tbody>
            `;
            categoryPriceMap.forEach((value, key) => {
                contentInfo += `<tr>
                <td>${categoriesDictionary.get(key).toUpperCase()}</td>
                <td>${value.toFixed(2)}€</td>
                </tr>`;
            })
            contentInfo +=`</tbody></table>`


            tradeContent.innerHTML = contentInfo;
        })
        .catch(error => {
            console.error('Error fetching trades:', error);
        });
}


fetchGetUrl('https://zombiesurvive.ddns.net:8444/kiosco/category/').then(categories => {
    categories.forEach(element => {
      categoriesDictionary.set(element.id, element.name); 
    });
  });