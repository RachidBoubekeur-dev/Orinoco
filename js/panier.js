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

    // Récupération des produits ajouter au panier dans le localStorage
        for (let y = 0; y < listCamera.length; y++) {

            let valuePanierId = localStorage.getItem("Panier " + listCamera[y]._id);

            if (valuePanierId !== null) {
                valuePanierId = JSON.parse(valuePanierId);
                arrayPanier.push(new Panier(valuePanierId.id, valuePanierId.name, valuePanierId.price, valuePanierId.imageUrl, valuePanierId.lense, valuePanierId.number));
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

        // Formate le prix envoyer
        let newPrice;
        let formatePrix = function (prix) {
            if (prix.length === 5) {
                if (prix.substr(3, 1) === "0") {
                newPrice = prix.substr(0, 3);
                } else {
                    newPrice = prix.substr(0, 3) + "," + prix.substr(3, 2);
                }
            } else if (prix.length === 6) {
                if (prix.substr(4, 1) === "0") {
                    newPrice = prix.substr(0, 4);
                } else {
                    newPrice = prix.substr(0, 4) + "," + prix.substr(4, 2);
                }
            } else if (prix.length === 1) {
                newPrice = prix.substr(0, 1);
            } else {
                if (prix.substr(5, 1) === "0") {
                    newPrice = prix.substr(0, 5);
                } else {
                    newPrice = prix.substr(0, 5) + "," + prix.substr(5, 2);
                }
            }
        }

        for (let i = 0; i < arrayPanier.length; i++) {

            // Formate le prix
            let price = arrayPanier[i].price;
            price = price.toString().substr(0, 5);

            // Calcule le prix en fonction de la quantité du même produit
            let prixTotalCam = parseInt(price, 10) * document.querySelector("#quantityCam" + i).value;
            prixTotalCam = prixTotalCam.toString();
            
            formatePrix(prixTotalCam);
            
            document.querySelector("#priceCam" + i).innerHTML = newPrice + "€";

            prixTotalPanier = prixTotalPanier + parseInt(prixTotalCam, 10);
        }

        // Formate le prix Total calculer
        prixTotalPanier = prixTotalPanier.toString();

        formatePrix(prixTotalPanier);

        document.querySelector("#prixTotalPanier").innerHTML = newPrice + "€";
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

            // On supprime le produit de localStorage
            localStorage.removeItem("Panier " + arrayPanier[i].id);
        });
    }

}).catch(function () {
    // Gestions des erreurs: affiche Error 404 et redirige le visiteur vers la page d'accueil à partir de 10s
    document.querySelector('#listPanier').innerHTML = '<h2 class=\"h1color text-center mb-5 h1 font-weight-normal\">Error 404</h2>';
    setTimeout(function () { document.location.href = "../index.html" }, 10000);
});

let formInputNom = document.querySelector('#InputNom');
let ErrorInputNom = document.querySelector('#ErrorInputNom');

let formInputPrenom = document.querySelector('#InputPrenom');
let ErrorInputPrenom = document.querySelector('#ErrorInputPrenom');

let formInputAdresse = document.querySelector('#InputAdresse');
let ErrorInputAdresse = document.querySelector('#ErrorInputAdresse');

let formInputVille = document.querySelector('#InputVille');
let ErrorInputVille = document.querySelector('#ErrorInputVille');

let formInputEmail = document.querySelector('#InputEmail');
let ErrorInputEmail = document.querySelector('#ErrorInputEmail');

let formInputCheck = document.querySelector('#InputCheck');
let ErrorInputCheck = document.querySelector('#ErrorInputCheck');

let regexAlpha = /^[a-z ,.'-éèàâêûîôäëüïöù][^0-9]+$/;
let regexAlphaNum = /^[a-z ,.'-éèàâêûîôäëüïöù]+$/;

let verifInputValid = [];


formInputNom.addEventListener('keyup', function () {
    if (formInputNom.value.length >= 2 && regexAlpha.test(formInputNom.value)) {
        ErrorInputNom.style.display = "none";
        verifInputValid[0] = true;
    } else {
        ErrorInputNom.textContent = "min 2 caractère valide";
        ErrorInputNom.style.display = "block";
        verifInputValid[0] = false;
    }
})

formInputPrenom.addEventListener('keyup', function () {
    if (formInputPrenom.value.length >= 2 && regexAlpha.test(formInputPrenom.value)) {
        ErrorInputPrenom.style.display = "none";
        verifInputValid[1] = true;
    } else {
        ErrorInputPrenom.textContent = "min 2 caractère valide";
        ErrorInputPrenom.style.display = "block";
        verifInputValid[1] = false;
    }
})

formInputAdresse.addEventListener('keyup', function () {
    if (formInputAdresse.value.length >= 10 && regexAlphaNum.test(formInputAdresse.value)) {
        ErrorInputAdresse.style.display = "none";
        verifInputValid[2] = true;
    } else {
        ErrorInputAdresse.textContent = "min 10 caractère valide";
        ErrorInputAdresse.style.display = "block";
        verifInputValid[2] = false;
    }
})

formInputVille.addEventListener('keyup', function () {
    if (formInputVille.value.length >= 3 && regexAlpha.test(formInputVille.value)) {
        ErrorInputVille.style.display = "none";
        verifInputValid[3] = true;
    } else {
        ErrorInputVille.textContent = "min 3 caractère valide";
        ErrorInputVille.style.display = "block";
        verifInputValid[3] = false;
    }
})

formInputEmail.addEventListener('keyup', function () {
    if (formInputEmail.value.length >= 8) {
        ErrorInputEmail.style.display = "none";

        if (formInputEmail.validity.valid) {
            ErrorInputEmail.style.display = "none";
            verifInputValid[4] = true;
        } else {
            ErrorInputEmail.textContent = "Email invalide";
            ErrorInputEmail.style.display = "block";
            verifInputValid[4] = false;
        }

    } else {
        ErrorInputEmail.textContent = "min 8 caractère valide";
        ErrorInputEmail.style.display = "block";
    }
})

document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();

    if (verifInputValid[0] === true && verifInputValid[1] === true && verifInputValid[2] === true && verifInputValid[3] === true && verifInputValid[4] === true) {
        if (formInputCheck.checked === true) {
            // Si le formulaire est soumis et valide on ajoute les info à l'object contact
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
        } else {
            ErrorInputCheck.textContent = "Merci de cocher la case";
            ErrorInputCheck.style.display = "block";
        }
    }
});