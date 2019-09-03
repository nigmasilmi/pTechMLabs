//Setting up the credentials for the session
document.addEventListener('DOMContentLoaded', () => {
    sessionStorage.setItem('providedToken', JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1yZW9kcmlndWV6IiwiaWF0IjoxNTY3MTE0NjIyLCJleHAiOjE1NjcxMTQ5MjJ9._CwEtsPNWATOTWOb6ffAeMtruKJHrl6YRrK_Fi_kY08'));

});



//function to get the text from the sample .txt file
const getText = () => {
    fetch('sample.txt')
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            document.getElementById('outPut').innerHTML = data;
        })
        .catch((err) => {
            document.getElementById('errorShow').innerHTML = err.message;
        });

};

document.getElementById('getTextBtn').addEventListener('click', getText);



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


document.getElementById('getSalesWithFetch').addEventListener('click', getSalesWithFetch);