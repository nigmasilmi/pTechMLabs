//Setting up the credentials for the session
document.addEventListener('DOMContentLoaded', () => {
    sessionStorage.setItem('currentToken', '' );
    authorizationFunk();

});



const authorizationFunk = () => {
    //display the auth div
    let base = document.createElement('div');
    base.setAttribute('id', 'authCanvas');
    base.setAttribute('class', 'container');

    let inputName = document.createElement('input');
    inputName.setAttribute('type', 'text');
    inputName.setAttribute('id', 'nameId');
    inputName.setAttribute('placeholder', 'Nombre de usuario');

    let inputPass = document.createElement('input');
    inputPass.setAttribute('type', 'password');
    inputPass.setAttribute('id', 'passId');
    inputPass.setAttribute('placeholder', 'Contraseña');

    let errorPlace = document.createElement('span');
    errorPlace.setAttribute('id', 'showMeTheError');

    let submitBtn = document.createElement('div');
    submitBtn.setAttribute('id', 'submitBtnId');
    submitBtn.textContent = 'Autenticarse';
    submitBtn.setAttribute('class', 'btn btn-danger');
    base.appendChild(inputName);
    base.appendChild(inputPass);
    base.appendChild(errorPlace);
    base.appendChild(submitBtn);

    document.getElementById('mainContainer').appendChild(base);

    document.getElementById('submitBtnId').addEventListener('click', () => {
        console.log('elboton funciona');
        let name = document.getElementById('nameId').value;
        console.log(name);
        let pass = document.getElementById('passId').value;
        console.log(pass);

        fetchAccessRequest(name, pass);
    });


};

//function that triggers the authentication process in server side
const fetchAccessRequest = (name, pass) => {
    
    let url = `https://marsol-test.herokuapp.com/login?user=${name}&&pass=${pass}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);
           const access_token = data.access_token;
           sessionStorage.setItem('currentToken', access_token);
           console.log(sessionStorage.getItem('currentToken'));
           document.getElementById('authCanvas').remove();
           document.getElementById('btnWrapper').setAttribute('class', 'show');
           
        })
        .catch(error => {
            console.log(error.message);
        });



};




// function that makes sales requests using  fetch

const getSalesWithFetch = () => {
    let url = 'https://marsol-test.herokuapp.com/history';
    let token = sessionStorage.getItem('currentToken');
    console.log(sessionStorage.getItem('currentToken'));
    let bigHead = new Headers();
    bigHead.append('Authentication', `Bearer ${token}`);
    let request = new Request(url, {
        method: 'GET',
        mode: 'cors',
        headers: bigHead

    });

    fetch(request)
        .then(res => res.json())
        .then(data => {
            console.log('this is data', data);
            console.log('this is data[0]', data[0]);
        })
        .catch(error => {
            console.log(error.message);
        });

};

//function that formats the date

const dateFormatting = (dateStr) => {
    const monthTranslator = {
        'Enero': '00',
        'Febrero': '01',
        'Marzo': '02',
        'Abril': '03',
        'Mayo': '04',
        'Junio': '05',
        'Julio': '06',
        'Agosto': '07',
        'Septiembre': '08',
        'Octubre': '09',
        'Noviembre': '10',
        'Diciembre': '11',
    };
    let year = '';
    let month = '';
    let day = '';
    let dWoHour = dateStr.split('T')[0].split('-');
    for (let h = 0; h < dWoHour.length; h++) {
        year = dWoHour[0];
        month = dWoHour[1];
        day = dWoHour[2];
    }
    for (month in monthTranslator) {
        if (monthTranslator.value === month) {
            month = monthTranslator.value;
        }
    }
    let stringToDisplay = `${day} de ${month} de ${year}`;
    return stringToDisplay;
};

// function that reports the last sales

const salesSoFar = () => {
    //sets the request
    let url = 'https://marsol-test.herokuapp.com/unsecure/history';
    let token = sessionStorage.getItem('currentToken');
    console.log(token);
    let bigHead = new Headers();
    bigHead.append('Authentication', `Bearer ${token}`);
    let request = new Request(url, {
        method: 'GET',
        mode: 'cors',
        headers: bigHead
    });


    //sets the DOM

    let listContent = '';
    document.getElementById('outPutItemSales').setAttribute('class', 'hide');
    document.getElementById('totalSales').removeAttribute('class', 'hide');
    document.getElementById('sellerSales').setAttribute('class', 'hide');

    //process the response

    fetch(request)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            data.forEach((sale) => {
                listContent +=
                    `<tr><td>${sale.cantidad_vendida}</td><td>${sale.total_vendido}</td><td>${dateFormatting(sale.fecha)}</td></tr>`;
            });
            
            

            document.getElementById('tSalesbdTab').innerHTML = listContent;

        })
        .catch(error => {
            console.log(error.message);
        });

};
document.getElementById('getSalesWithFetch').addEventListener('click', salesSoFar);




// function that reports the sales for each seller

const salesEachSeller = (seller) => {
    let sellerToRequest = '';
    const sellersArray = ['abustos', 'ndiaz', 'mreodriguez', 'emarin'];
    sellersArray.forEach((name) => {
        if (seller === name) {
            sellerToRequest = name;
        }
    });

    //sets the DOM
    document.getElementById('totalSales').setAttribute('class', 'hide');
    document.getElementById('sellerSales').setAttribute('class', 'table table-dark');
    document.getElementById('sellerToDisplay').textContent = sellerToRequest;

    console.log(sellerToRequest);

    //sets the request
    let url = `https://marsol-test.herokuapp.com/unsecure/history/vendedor/${sellerToRequest}`;
    let token = sessionStorage.getItem('currentToken');
    let bigHead = new Headers();
    bigHead.append('Authentication', `Bearer ${token}`);
    let request = new Request(url, {
        method: 'GET',
        mode: 'cors',
        headers: bigHead
    });
    //sets the DOM

    let listContent = '';

    //process the response
    fetch(request)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            data.forEach((sale) => {
                listContent +=
                    `<tr><td>${sale.cantidad_vendida}</td><td>${sale.total_vendido}</td><td>${dateFormatting(sale.fecha)}</td></tr>`;

            });
            document.getElementById('tSellerbdTab').innerHTML = listContent;

            

        })
        .catch(error => {
            console.log('hubo un problema en la obtención de la data de ventas por vendedor');
        });
        

};
// document.getElementById('getSellerSales').addEventListener('click', salesEachSeller);


// function that reports the sales per item
const salesPerItem = () => {
    //sets the request
    let url = 'https://marsol-test.herokuapp.com/unsecure/items';
    let token = sessionStorage.getItem('currentToken');
    console.log(token);
    let bigHead = new Headers();
    bigHead.append('Authentication', `Bearer ${token}`);
    let request = new Request(url, {
        method: 'GET',
        mode: 'cors',
        headers: bigHead
    });


    //sets the DOM

    let listContent = '';
    document.getElementById('outPutItemSales').removeAttribute('class', 'hide');
    document.getElementById('totalSales').setAttribute('class', 'hide');
    document.getElementById('sellerSales').setAttribute('class', 'hide');

    //process the response

    fetch(request)
        .then(res => res.json())
        .then(data => {
            console.log('esto es la data de items',data);
            data.forEach((item) => {
                listContent +=
                    `<tr><td>${item.codigo}</td><td>${item.descripcion}</td><td>${item.precio}</td></tr>`;
            });
            
            
            document.getElementById('tItembdTab').innerHTML = listContent;

        })
        .catch(error => {
            console.log(error.message);
        });

};
document.getElementById('getSalesPerItem').addEventListener('click', salesPerItem);



// receives the seller by the clicked button and calls the function to request the sales data
let btnGroup = document.querySelectorAll('.dropdown-item');
Array.from(btnGroup).forEach((element => {
    element.addEventListener('click', (event)=>{
        let sellerRequested = event.target.value;
        salesEachSeller(sellerRequested);
    });
 
}));
