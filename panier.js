let getXhr = function (url) {
    return new Promise(function (resolve, reject) {

        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr);
                }
            }
        }

        xhr.open('GET', url);
        xhr.send();
    });
};

let getListCamera = function () {
    return getXhr('http://localhost:3000/api/cameras').then(function (response) {
        let listCamera = JSON.parse(response);
        return listCamera;
    });
};

class Panier {
    constructor(id, name, price, imageUrl, number) {
        this.id = id,
            this.name = name,
            this.price = price,
            this.imageUrl = imageUrl,
            this.number = number
    }
}

getListCamera().then(function (listCamera) {
    let arrayPanier = [];

    for (let i = 0; i < localStorage.length; i++) {

        let panierId = localStorage.getItem(localStorage.key(i));

        for (let y = 0; y < listCamera.length; y++) {

            if (listCamera[y]._id === panierId) {

                if (arrayPanier.length === 0) {
                    arrayPanier.push(new Panier(listCamera[y]._id, listCamera[y].name, listCamera[y].price, listCamera[y].imageUrl, 1));
                    break;
                } else {
                    for (let x = 0; x < arrayPanier.length; x++) {

                        if (arrayPanier[x].id === listCamera[y]._id) {
                            arrayPanier[x].number++;
                            break;
                        } else if (x + 1 === arrayPanier.length) {
                            arrayPanier.push(new Panier(listCamera[y]._id, listCamera[y].name, listCamera[y].price, listCamera[y].imageUrl, 1));
                            break;
                        }
                    }
                }
            }
        }

    }

    let htmlListPanier = "";
    for (let i = 0; i < arrayPanier.length; i++) {
        htmlListPanier += "<div id=\"card" + arrayPanier[i].id + "\" class=\"cardPanier card col-11 col-md-12 p-0 mb-3 text-center\"><div class=\"card-body d-md-flex justify-content-between align-items-center p-0\"><img id=\"imageCam" + i + "\" class=\"w-110 w100Img max-hImg\" src=\"" + arrayPanier[i].imageUrl + "\" alt=\"Caméra " + arrayPanier[i].name + "\"><h3 id=\"nameCam" + i + "\" class=\"card-title h1color mt-3 mt-md-2 namecardPanier\">" + arrayPanier[i].name + "</h3><h3 id=\"priceCam" + i + "\" class=\"card-title h1color mt-2 prixcardPanier\"></h3><input id=\"quantityCam" + i + "\" class=\"quantityCamPanier form-control d-inline-block\" type=\"number\" value=\"" + arrayPanier[i].number + "\" min=\"1\" max=\"100\"><i id=\"deleteCam" + i + "\" class=\"fas fa-trash-alt h1color h5 mt-2 mr-md-5 pointer\"></i></div></div>";
    }

    document.querySelector('#listPanier').innerHTML = htmlListPanier;

    let getPrice = function () {
        let prixTotalPanier = 0;
        if (localStorage.length === 0) {
            document.querySelector("#title").innerHTML = "#Votre Panier est vide";
        } else {
            document.querySelector("#title").innerHTML = "#Votre Panier";
        }

        for (let i = 0; i < arrayPanier.length; i++) {

            let price = arrayPanier[i].price;

            price = price.toString().substr(0, 5);

            let prixTotalCam = parseInt(price, 10) * document.querySelector("#quantityCam" + i).value;
            prixTotalCam = prixTotalCam.toString();

            let newPrice = prixTotalCam;

            prixTotalPanier = prixTotalPanier + parseInt(newPrice, 10);

            if (prixTotalCam.length === 5) {
                if (prixTotalCam.substr(3, 1) === "0") {
                    newPrice = prixTotalCam.substr(0, 3);
                } else {
                    newPrice = prixTotalCam.substr(0, 3) + "," + prixTotalCam.substr(3, 2);
                }
            } else if (prixTotalCam.length === 6) {
                if (prixTotalCam.substr(4, 1) === "0") {
                    newPrice = prixTotalCam.substr(0, 4);
                } else {
                    newPrice = prixTotalCam.substr(0, 4) + "," + prixTotalCam.substr(4, 2);
                }
            } else if (prixTotalCam.length === 1) {
                newPrice = prixTotalCam.substr(0, 1);
            } else {
                if (prixTotalCam.substr(5, 1) === "0") {
                    newPrice = prixTotalCam.substr(0, 5);
                } else {
                    newPrice = prixTotalCam.substr(0, 5) + "," + prixTotalCam.substr(5, 2);
                }
            }

            document.querySelector("#priceCam" + i).innerHTML = newPrice + "€";
        }

        prixTotalPanier = prixTotalPanier.toString();
        let newPrixTotalPanier;

        if (prixTotalPanier.length === 5) {
            if (prixTotalPanier.substr(3, 1) === "0") {
                newPrixTotalPanier = prixTotalPanier.substr(0, 3);
            } else {
                newPrixTotalPanier = prixTotalPanier.substr(0, 3) + "," + prixTotalPanier.substr(3, 2);
            }
        } else if (prixTotalPanier.length === 6) {
            if (prixTotalPanier.substr(4, 1) === "0") {
                newPrixTotalPanier = prixTotalPanier.substr(0, 4);
            } else {
                newPrixTotalPanier = prixTotalPanier.substr(0, 4) + "," + prixTotalPanier.substr(4, 2);
            }
        } else if (prixTotalPanier.length === 1) {
            newPrixTotalPanier = prixTotalPanier.substr(0, 1);
        } else {
            if (prixTotalPanier.substr(5, 1) === "0") {
                newPrixTotalPanier = prixTotalPanier.substr(0, 5);
            } else {
                newPrixTotalPanier = prixTotalPanier.substr(0, 5) + "," + prixTotalPanier.substr(5, 2);
            }
        }

        document.querySelector("#prixTotalPanier").innerHTML = newPrixTotalPanier + "€";
    }

    getPrice();

    for (let i = 0; i < arrayPanier.length; i++) {
        let inputNumber = document.querySelector("#quantityCam" + i);
        let deleteCam = document.querySelector("#deleteCam" + i);

        inputNumber.addEventListener('input', function() {
            arrayPanier[i].number = inputNumber.value;
            getPrice();
        });

        deleteCam.addEventListener('click', function () {
            document.querySelector('#card' + arrayPanier[i].id).style.opacity = 0;
            document.querySelector('#card' + arrayPanier[i].id).style.marginLeft = "-50%";
            setTimeout(function () { 
                document.querySelector('#card' + arrayPanier[i].id).style.marginTop = "-91px";
                arrayPanier[i].price = 0;
                getPrice();
            }, 1000);
            setTimeout(function () { 
                document.querySelector('#card' + arrayPanier[i].id).style.display = "none";
            }, 3000);

            for (let y = 0; y < localStorage.length; y++) {
                let deletePanierId = localStorage.getItem(localStorage.key(y));
                if (arrayPanier[i].id === deletePanierId) {
                    localStorage.removeItem(localStorage.key(y));
                }
            }

            for (let y = 0; y < localStorage.length; y++) {
                let deletePanierId = localStorage.getItem(localStorage.key(y));
                if (arrayPanier[i].id === deletePanierId) {
                    localStorage.removeItem(localStorage.key(y));
                }
            }
        });
    }

}).catch(function () {
    document.querySelector('#listPanier').innerHTML = '<h1 class=\"h1color text-center mb-5\">Error 404</h1>';
});