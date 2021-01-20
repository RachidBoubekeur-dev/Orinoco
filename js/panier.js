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

// Demande la liste des caméras
let getListCamera = function () {
    return getXhr('http://localhost:3000/api/cameras').then(function (response) {
        let listCamera = JSON.parse(response);
        return listCamera;
    });
};

class Panier {
    constructor(id, name, price, imageUrl, lense, number) {
        this.id = id,
            this.name = name,
            this.price = price,
            this.imageUrl = imageUrl,
            this.lense = lense,
            this.number = number
    }
}

getListCamera().then(function (listCamera) {
    let arrayPanier = [];

    localStorage.removeItem('click Camera');
    // Récupération des produits ajouter au panier dans le localStorage
    for (let i = 0; i < localStorage.length; i++) {

        let panierId = localStorage.getItem(localStorage.key(i));

        for (let y = 0; y < listCamera.length; y++) {

            if (listCamera[y]._id === panierId) {

                let lenseOption = localStorage.getItem("Lense " + panierId);

                // Ajouts du 1er produit dans arrayPanier
                if (arrayPanier.length === 0) {
                    arrayPanier.push(new Panier(listCamera[y]._id, listCamera[y].name, listCamera[y].price, listCamera[y].imageUrl, lenseOption, 1));
                    break;
                } else {
                    for (let x = 0; x < arrayPanier.length; x++) {

                        if (arrayPanier[x].id === listCamera[y]._id) {
                            // Si l'id est déjà présent dans le arrayPanier on ajoute + 1 au number de l'article
                            arrayPanier[x].number++;
                            break;
                        } else if (x + 1 === arrayPanier.length) {
                            // Ajouts du produit dans arrayPanier
                            arrayPanier.push(new Panier(listCamera[y]._id, listCamera[y].name, listCamera[y].price, listCamera[y].imageUrl, lenseOption, 1));
                            break;
                        }
                    }
                }
            }
        }

    }

    let htmlListPanier = "";
    for (let i = 0; i < arrayPanier.length; i++) {

        // Ajout successif des caméras dans htmlListPanier
        htmlListPanier += "<div id=\"card" + arrayPanier[i].id + "\" class=\"cardPanier card col-11 col-md-12 p-0 mb-3 text-center\"><div class=\"card-body d-md-flex justify-content-between align-items-center p-0\"><img id=\"imageCam" + i + "\" class=\"w-110 w100Img max-hImg\" src=\"" + arrayPanier[i].imageUrl + "\" alt=\"Caméra " + arrayPanier[i].name + "\"><h3 id=\"nameCam" + i + "\" class=\"card-title h1color mt-3 mt-md-2 namecardPanier\">" + arrayPanier[i].name + "</h3><div class=\"widthElement\"><p id=\"optionCam" + i + "\" class=\"h1color pt-3 mt-3 mt-md-2\" title=\"Option lentille : " + arrayPanier[i].lense + "\">" + arrayPanier[i].lense + "</p></div><h3 id=\"priceCam" + i + "\" class=\"card-title h1color mt-2 prixcardPanier\"></h3><input id=\"quantityCam" + i + "\" class=\"quantityCamPanier form-control d-inline-block\" type=\"number\" value=\"" + arrayPanier[i].number + "\" min=\"1\" max=\"100\"><i id=\"deleteCam" + i + "\" class=\"fas fa-trash-alt h1color h5 mt-2 mr-md-5 pointer\"></i></div></div>";
    }

    document.querySelector('#listPanier').innerHTML = htmlListPanier;

    // Function qui calcule et formate le prix à chaque appel
    let getPrice = function () {
        let prixTotalPanier = 0;

        if (localStorage.length !== 0) {
            document.querySelector("#title").innerHTML = "#Votre panier";
            document.querySelector("#formPanier").style.display = "flex";
        } else {
            document.querySelector("#title").innerHTML = "#Votre panier est vide";
            document.querySelector("#formPanier").style.display = "none";
            setTimeout(function () { document.location.href = "../index.html" }, 10000);
        }

        for (let i = 0; i < arrayPanier.length; i++) {

            // Formate le prix
            let price = arrayPanier[i].price;

            price = price.toString().substr(0, 5);

            // Calcule le prix en fonction de la quantité du même produit
            let prixTotalCam = parseInt(price, 10) * document.querySelector("#quantityCam" + i).value;
            prixTotalCam = prixTotalCam.toString();

            let newPrice = prixTotalCam;

            // Formate le prix calculer
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

        // Formate le prix Total calculer
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
        let lenseOption = document.querySelector("#optionCam" + i);

        if (arrayPanier[i].lense === "Lentilles..." || arrayPanier[i].lense === null) {
            lenseOption.parentNode.style.display = "none";
        }

        inputNumber.addEventListener('input', function () {

            // À chaque nouvelle quantité on recalcule les prix
            arrayPanier[i].number = inputNumber.value;
            getPrice();
        });

        deleteCam.addEventListener('click', function () {
            // Effet visuel lorsque que le produit est supprimé
            document.querySelector('#card' + arrayPanier[i].id).style.opacity = 0;
            document.querySelector('#card' + arrayPanier[i].id).style.marginLeft = "-50%";
            setTimeout(function () {
                let heightDiv = document.querySelector('#card' + arrayPanier[i].id).offsetHeight;
                heightDiv = heightDiv + 20;
                document.querySelector('#card' + arrayPanier[i].id).style.marginTop = "-" + heightDiv + "px";
                arrayPanier[i].price = 0;
                // À chaque suppression on recalcule les prix
                getPrice();
            }, 1400);
            setTimeout(function () {
                document.querySelector('#card' + arrayPanier[i].id).style.display = "none";
            }, 3000);

            // On supprime le produit de localStorage ainsi que son option de lentille
            for (let y = 0; y < localStorage.length; y++) {
                let deletePanierId = localStorage.getItem(localStorage.key(y));
                if (arrayPanier[i].id === deletePanierId) {
                    localStorage.removeItem(localStorage.key(y));
                    y--;
                    let lenseDelete = localStorage.getItem("Lense " + deletePanierId);
                    if (lenseDelete !== null) {
                        localStorage.removeItem("Lense " + deletePanierId);
                        y--;
                    }
                }
            }
        });
    }

}).catch(function () {
    // Gestions des erreurs: affiche Error 404 et redirige le visiteur vers la page d'accueil à partir de 10s
    document.querySelector('#listPanier').innerHTML = '<h2 class=\"h1color text-center mb-5 h1 font-weight-normal\">Error 404</h2>';
    setTimeout(function () { document.location.href = "../index.html" }, 10000);
});

document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();
    // Si le formulaire est soumis et valide on récupère les infos et on les ajoute à l'object contact
    let formInputNom = document.querySelector('#InputNom');
    let formInputPrenom = document.querySelector('#InputPrenom');
    let formInputAdresse = document.querySelector('#InputAdresse');
    let formInputVille = document.querySelector('#InputVille');
    let formInputEmail = document.querySelector('#InputEmail');

    let contact = new Object();
    contact.firstName = encodeURIComponent(formInputPrenom.value);
    contact.lastName = encodeURIComponent(formInputNom.value);
    contact.address = encodeURIComponent(formInputAdresse.value);
    contact.city = encodeURIComponent(formInputVille.value);
    contact.email = encodeURIComponent(formInputEmail.value);

    // On ajoute les id de tous les produits ajouter au panier dans array products
    let products = [];

    for (let i = 0; i < localStorage.length; i++) {
        let PanierId = localStorage.getItem("Panier " + i);
        if (PanierId !== null) {
            products.push(PanierId);
        }
    }

    const dataOrder = {
        contact,
        products
    };

    let priceOrder = document.querySelector("#prixTotalPanier");

    // On stock dataOrder et priceOrder dans le localStrorage
    localStorage.setItem('Order', JSON.stringify(dataOrder));
    localStorage.setItem('priceOrder', priceOrder.textContent);
    // Redirection vers la page order pour le traitement de la commande
    document.location.href = "order.html";
});