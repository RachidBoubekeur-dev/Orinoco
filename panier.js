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

let postXhr = function (url, contact, arrayIdCamera) {
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

        xhr.open('POST', url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(contact, arrayIdCamera);
    });
};

let getListCamera = function () {
    return getXhr('http://localhost:3000/api/cameras').then(function (response) {
        let listCamera = JSON.parse(response);
        return listCamera;
    });
};

let postOrder = function (contact, arrayIdCamera) {
    return postXhr('http://localhost:3000/api/cameras/order', contact, arrayIdCamera).then(function (response) {
        let order = JSON.parse(response);
        return order;
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

    for (let i = 0; i < localStorage.length; i++) {

        let panierId = localStorage.getItem(localStorage.key(i));

        for (let y = 0; y < listCamera.length; y++) {

            if (listCamera[y]._id === panierId) {

                let lenseOption = localStorage.getItem("Lense " + panierId);

                if (arrayPanier.length === 0) {
                    arrayPanier.push(new Panier(listCamera[y]._id, listCamera[y].name, listCamera[y].price, listCamera[y].imageUrl, lenseOption, 1));
                    break;
                } else {
                    for (let x = 0; x < arrayPanier.length; x++) {

                        if (arrayPanier[x].id === listCamera[y]._id) {
                            arrayPanier[x].number++;
                            break;
                        } else if (x + 1 === arrayPanier.length) {
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

        htmlListPanier += "<div id=\"card" + arrayPanier[i].id + "\" class=\"cardPanier card col-11 col-md-12 p-0 mb-3 text-center\"><article class=\"card-body d-md-flex justify-content-between align-items-center p-0\"><img id=\"imageCam" + i + "\" class=\"w-110 w100Img max-hImg\" src=\"" + arrayPanier[i].imageUrl + "\" alt=\"Caméra " + arrayPanier[i].name + "\"><h3 id=\"nameCam" + i + "\" class=\"card-title h1color mt-3 mt-md-2 namecardPanier\">" + arrayPanier[i].name + "</h3><div class=\"widthElement\"><p id=\"optionCam" + i + "\" class=\"h1color pt-3 mt-3 mt-md-2\" title=\"Option lentille : " + arrayPanier[i].lense + "\">" + arrayPanier[i].lense + "</p></div><h3 id=\"priceCam" + i + "\" class=\"card-title h1color mt-2 prixcardPanier\"></h3><input id=\"quantityCam" + i + "\" class=\"quantityCamPanier form-control d-inline-block\" type=\"number\" value=\"" + arrayPanier[i].number + "\" min=\"1\" max=\"100\"><i id=\"deleteCam" + i + "\" class=\"fas fa-trash-alt h1color h5 mt-2 mr-md-5 pointer\"></i></article></div>";
    }

    document.querySelector('#listPanier').innerHTML = htmlListPanier;

    let getPrice = function () {
        let prixTotalPanier = 0;
        if (localStorage.length === 0) {
            document.querySelector("#title").innerHTML = "#Votre Panier est vide";
            document.querySelector('#buttonCommander').style.display = "none";
        } else {
            document.querySelector("#title").innerHTML = "#Votre Panier";
            document.querySelector('#buttonCommander').innerHTML = "Commander";
            document.querySelector('#buttonCommander').style.display = "block";
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
        let lenseOption = document.querySelector("#optionCam" + i);

        if (arrayPanier[i].lense === "Lentilles...") {
            lenseOption.parentNode.style.display = "none";
        }

        inputNumber.addEventListener('input', function () {
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
            }, 1400);
            setTimeout(function () {
                document.querySelector('#card' + arrayPanier[i].id).style.display = "none";
            }, 3000);

            for (let y = 0; y < localStorage.length; y++) {
                let deletePanierId = localStorage.getItem(localStorage.key(y));
                if (arrayPanier[i].id === deletePanierId) {
                    localStorage.removeItem(localStorage.key(y));
                    localStorage.removeItem("Lense " + deletePanierId);
                }
            }

            for (let y = 0; y < localStorage.length; y++) {
                let deletePanierId = localStorage.getItem(localStorage.key(y));
                if (arrayPanier[i].id === deletePanierId) {
                    localStorage.removeItem(localStorage.key(y));
                    localStorage.removeItem("Lense " + deletePanierId);
                }
            }
        });
    }

    let buttonCommander = document.querySelector("#buttonCommander");
    let listPanier = document.querySelector("#listPanier");
    let formPanier = document.querySelector("#formPanier");
    let closeFormPanier = document.querySelector("#closePageCam");

    buttonCommander.addEventListener('click', function () {
        buttonCommander.style.display = "none";
        listPanier.style.opacity = 0;
        setTimeout(function () {
            listPanier.style.display = "none";
            formPanier.style.display = "flex";
        }, 600);

        setTimeout(function () {
            formPanier.style.opacity = 1;
        }, 650);
    });

    closeFormPanier.addEventListener('click', function () {
        formPanier.style.opacity = 0;
        setTimeout(function () {
            formPanier.style.display = "none";
            listPanier.style.display = "flex";
        }, 600);

        setTimeout(function () {
            listPanier.style.opacity = 1;
        }, 650);
        buttonCommander.style.display = "block";
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
    let formBtnCommander = document.querySelector('#formBtnCommander');

    let regexAlpha = /^[a-zA-Z]+$/;

    let verifInputValid = [];

    formInputNom.addEventListener('keyup', function () {
        if (formInputNom.value.length >= 2 && regexAlpha.test(formInputNom.value)) {
            formInputNom.style.border = "1px solid #ced4da";
            ErrorInputNom.style.display = "none";
            verifInputValid[0] = true;
        } else {
            formInputNom.style.border = "2px solid purple";
            ErrorInputNom.textContent = "min 2 caractère valide";
            ErrorInputNom.style.display = "block";
            verifInputValid[0] = false;
        }
    })

    formInputPrenom.addEventListener('keyup', function () {
        if (formInputPrenom.value.length >= 2 && regexAlpha.test(formInputPrenom.value)) {
            formInputPrenom.style.border = "1px solid #ced4da";
            ErrorInputPrenom.style.display = "none";
            verifInputValid[1] = true;
        } else {
            formInputPrenom.style.border = "2px solid purple";
            ErrorInputPrenom.textContent = "min 2 caractère valide";
            ErrorInputPrenom.style.display = "block";
            verifInputValid[1] = false;
        }
    })

    formInputAdresse.addEventListener('keyup', function () {
        if (formInputAdresse.value.length >= 10) {
            formInputAdresse.style.border = "1px solid #ced4da";
            ErrorInputAdresse.style.display = "none";
            verifInputValid[2] = true;
        } else {
            formInputAdresse.style.border = "2px solid purple";
            ErrorInputAdresse.textContent = "min 10 caractère valide";
            ErrorInputAdresse.style.display = "block";
            verifInputValid[2] = false;
        }
    })

    formInputVille.addEventListener('keyup', function () {
        if (formInputVille.value.length >= 10 && regexAlpha.test(formInputVille.value)) {
            formInputVille.style.border = "1px solid #ced4da";
            ErrorInputVille.style.display = "none";
            verifInputValid[3] = true;
        } else {
            formInputVille.style.border = "2px solid purple";
            ErrorInputVille.textContent = "min 10 caractère valide";
            ErrorInputVille.style.display = "block";
            verifInputValid[3] = false;
        }
    })

    formInputEmail.addEventListener('keyup', function () {
        if (formInputEmail.value.length >= 8) {
            formInputEmail.style.border = "1px solid #ced4da";
            ErrorInputEmail.style.display = "none";

            if (formInputEmail.validity.valid) {
                formInputEmail.style.border = "1px solid #ced4da";
                ErrorInputEmail.style.display = "none";
                verifInputValid[4] = true;
            } else {
                formInputEmail.style.border = "2px solid purple";
                ErrorInputEmail.textContent = "Email invalide";
                ErrorInputEmail.style.display = "block";
                verifInputValid[4] = false;
            }

        } else {
            formInputEmail.style.border = "2px solid purple";
            ErrorInputEmail.textContent = "min 8 caractère valide";
            ErrorInputEmail.style.display = "block";
        }
    })

    formBtnCommander.addEventListener('click', function () {
        if(verifInputValid[0] === true && verifInputValid[1] === true && verifInputValid[2] === true && verifInputValid[3] === true && verifInputValid[4] === true) {
            if (formInputCheck.checked) {
                formInputCheck.parentNode.style.border = "none";
                
                let contact = new Object();
                contact.firstName = formInputPrenom.value;
                contact.lastName = formInputNom.value;
                contact.adresse = formInputAdresse.value;
                contact.city = formInputVille.value;
                contact.email = formInputEmail.value;

                let arrayIdCamera = [];

                for (let i = 0; i < arrayPanier; i++) {
                    arrayIdCamera.push(arrayPanier[i].id);
                }
                
                postOrder(contact, arrayIdCamera).then(function(order) {
                    alert('OK');
                    console.log(order);
                }).catch(function() {
                    console.error('error');
                });
            } else {
                formInputCheck.parentNode.style.border = "1px solid purple";
            }
        }
    });

}).catch(function () {
    document.querySelector('#listPanier').innerHTML = '<h2 class=\"h1color text-center mb-5\">Error 404</h2>';
});