//Setting up the credentials for the session
document.addEventListener('DOMContentLoaded', () => {
    sessionStorage.setItem('providedToken', JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1yZW9kcmlndWV6IiwiaWF0IjoxNTY3MTE0NjIyLCJleHAiOjE1NjcxMTQ5MjJ9._CwEtsPNWATOTWOb6ffAeMtruKJHrl6YRrK_Fi_kY08'));

});

// function that makes request auth using the xmlhttpr object

const getAuthWithXhr = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://marsol-test.herokuapp.com/login?user=mreodriguez&&pass=EstaEsMiSuperClave', true);
    xhr.onload = () => {
        if (this.status == 200) {
            var response = xhr;
            console.log(JSON.parse(response));
        } else {
            console.log(xhr.status);
        }
    };
    xhr.send();
};


document.getElementById('getWithxhr').addEventListener('click', getAuthWithXhr);


// function that makes sales requests using xhr

const getSalesWithXhr = () => {
    const xhr = new XMLHttpRequest();
    let bigHead = new Headers();
    bigHead.append('Authentication', `Bearer ${token}`);
    let request = new Request(url, {
        method: 'GET',
        mode: 'cors',
        headers: bigHead

    });
    xhr.open(request);
    xhr.onload = () => {
        if (this.status == 200) {
            var response = xhr;
            console.log(JSON.parse(response));
        } else {
            console.log(xhr.status);
        }
    };
    xhr.send();
};

document.getElementById('getWithxhr').addEventListener('click', getSalesWithXhr);

// //function that sets  the request
// const makeTheRequest = ()=>{
//     let url = 'https://marsol-test.herokuapp.com/unsecure/history';
//     let token = JSON.parse(sessionStorage.getItem('providedToken'));
//     let bigHead = new Headers();
//     bigHead.append('Authentication', `Bearer ${token}`);
//     let request = new Request(url, {
//         method: 'GET',
//         mode: 'cors',
//         headers: bigHead
//     });
// };


// function that makes sales requests using  fetch

const getSalesWithFetch = () => {
    let url = 'https://marsol-test.herokuapp.com/unsecure/history';
    let token = JSON.parse(sessionStorage.getItem('providedToken'));
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
dateFormatting('2019-07-03T00:00:00.000Z');

// function that reports the last sales

const salesSoFar = () => {
    //sets the request
    let url = 'https://marsol-test.herokuapp.com/unsecure/history';
    let token = JSON.parse(sessionStorage.getItem('providedToken'));
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
    sellersArray.forEach((name)=>{
        if (seller === name){
            sellerToRequest = name;
        }
    });
    console.log(sellerToRequest);
    //sets the request
    let url = `https://marsol-test.herokuapp.com/unsecure/history/vendedor/${sellerToRequest}`;
    let token = JSON.parse(sessionStorage.getItem('providedToken'));
    let bigHead = new Headers();
    bigHead.append('Authentication', `Bearer ${token}`);
    let request = new Request(url, {
        method: 'GET',
        mode: 'cors',
        headers: bigHead
    });
    //sets the DOM
    document.getElementById('sellerToDisplay').textContent= sellerToRequest;
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
            console.log(error.message);
        });

};
// document.getElementById('getSellerSales').addEventListener('click', salesEachSeller);

// receives the seller by the clicked button and calls the function to request the sales data
let btnGroup = document.querySelectorAll('.dropdown-item');
btnGroup.forEach(this.addEventListener('click', (e)=>{
    let sellerRequested = e.target.value;
    salesEachSeller(sellerRequested);
}));


