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

// Demande les infos de la caméras
let getCamera = function (id) {
    return getXhr('http://localhost:3000/api/cameras/' + id).then(function (response) {
        let camera = JSON.parse(response);
        return camera;
    });
};

let getIdCam = localStorage.getItem('click Camera');

getCamera(getIdCam).then(function (camera) {

    // Formate le prix
    let price = camera.price;
    price = price.toString();

    let newPrice = price.substr(0, 3);

    if (price.length === 6) {
        newPrice += "," + price.substr(3, 2);
    }

    // Créations et ajouts des lentilles
    for (let y = 0; y < camera.lenses.length; y++) {
        let optionLense = document.createElement("option");
        optionLense.innerHTML = camera.lenses[y];
        optionLense.setAttribute("id", "optionLense");
        document.querySelector('#lensesCam').appendChild(optionLense);
    }

    // Ajout des infos de la caméra à leurs éléments HTML
    document.querySelector('#imageCam').setAttribute("src", camera.imageUrl);
    document.querySelector('#imageCam').setAttribute("alt", "Caméra " + camera.name);
    document.querySelector('#nameCam').innerHTML = camera.name;
    document.querySelector('#descriptionCam').innerHTML = camera.description;
    document.querySelector('#priceCam').innerHTML = newPrice + "€";
    document.querySelector('#pageCam').style.opacity = 1;

    let ajoutPanier = document.querySelector('.ajoutPanier');

    ajoutPanier.addEventListener('click', function () {
        // Action lorsque l'élément est ajouter au panier
        let optionCam = document.querySelector("#lensesCam").value;
        // Ajout de l'id et de la lentille sélectionner dans le localStorage répétition en fonction de la quantité désirée
        for (let i = 0; i < quantityCam.value; i++) {
            let numberPanier = "Panier " + localStorage.length;
            let lensesPanier = "Lense " + camera._id;
            localStorage.setItem(numberPanier, camera._id);
            localStorage.setItem(lensesPanier, optionCam);
        }

        let infoPanier = document.querySelector("#infoPanier");
        let closeInfoPanier = document.querySelector("#closeInfoPanier");
        let textInfoPanier = document.querySelector("#textInfoPanier");

        // Affichage de la quantité si plusieur et/ou de l'article ajouter au panier
        if (quantityCam.value > 1) {
            textInfoPanier.innerHTML = quantityCam.value + " Caméra " + camera.name + " ajoutez au panier";
        } else {
            textInfoPanier.innerHTML = "Caméra " + camera.name + " ajoutez au panier";
        }

        // Affichage de la bulle d'information de l'article ajouter au panier
        infoPanier.style.display = "block";
        setTimeout(function () { infoPanier.style.opacity = 1; }, 60);
        setTimeout(function () { infoPanier.style.opacity = 0; }, 3500);
        setTimeout(function () { infoPanier.style.display = "none"; }, 4100);

        closeInfoPanier.addEventListener('click', function (e) {
            e.preventDefault();
            infoPanier.style.opacity = 0;
            setTimeout(function () { infoPanier.style.display = "none"; }, 1600);
        });
    });

}).catch(function () {
    // Gestions des erreurs: redirection vers la page d'accueil
    document.location.href = "../index.html";
});