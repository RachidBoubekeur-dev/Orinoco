let urlCamera = new URLSearchParams(document.location.href);
let getIdCam = urlCamera.get("Camera");

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
        let infoPanier = document.querySelector("#infoPanier");
        let closeInfoPanier = document.querySelector("#closeInfoPanier");
        let textInfoPanier = document.querySelector("#textInfoPanier");

        // Ajout de la caméra dans le localStorage
        let cameraOrder = new Object();
        cameraOrder.id = camera._id;
        cameraOrder.name = camera.name;
        cameraOrder.price = camera.price;
        cameraOrder.imageUrl = camera.imageUrl;
        cameraOrder.lense = optionCam;
        cameraOrder.number = quantityCam.value;

        let PanierId = "Panier " + camera._id;
        localStorage.setItem(PanierId, JSON.stringify(cameraOrder));

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