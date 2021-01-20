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


let listCam = document.querySelector('#listCam');
let pageCam = document.querySelector('#pageCam');
let quantityCam = document.querySelector('#quantityCam');
let closePageCam = document.querySelector('#closePageCam');

getListCamera().then(function (listCamera) {

    let listCameraHtml = "";
    for (let i = 0; i < listCamera.length; i++) {

        // formate le prix
        let price = listCamera[i].price;
        price = price.toString();

        let newPrice = price.substr(0, 3);

        if (price.length === 6) {
            newPrice += "," + price.substr(3, 2);
        }

        // Ajout successif des caméras dans listCameraHtml
        listCameraHtml += "<div class=\"col mb-5\"><figure id=\"" + listCamera[i]._id + "\" class=\"camera card\"><div class=\"prixcard\"><span>" + newPrice + "€</span></div><img src=\"" + listCamera[i].imageUrl + "\" class=\"card-img-top\" alt=\"Caméra " + listCamera[i].name + "\"><figcaption class=\"card-body\"><h5 class=\"card-title\">" + listCamera[i].name + "</h5><span class=\"h1color\">Voir la description</span></figcaption></figure></div>";
    };

    document.querySelector('#listCam').innerHTML = listCameraHtml;

    let divCam = document.querySelectorAll('figure.camera');
    for (let i = 0; i < divCam.length; i++) {
        let cam = divCam[i];
        cam.addEventListener('click', function () {
            // Lorsque le visiteur click sur le produit on identifie l'id caméra et on le stock dans le localStorage
            let getIdCam = cam.getAttribute("id");
            localStorage.setItem('click Camera', getIdCam);
            // Redirection à la page product contenant la description de l'article 
            document.location.href = "html/product.html#pageCam";
        });
    }

}).catch(function () {
    // Gestions des erreurs: affiche Error 404 et redirige le visiteur vers la page d'accueil à partir de 10s
    document.querySelector('#listCam').innerHTML = '<h2 class=\"h1color text-center mb-5 h1 font-weight-normal\">Error 404</h2>';
    setTimeout(function () { document.location.href = "../index.html" }, 10000);
});