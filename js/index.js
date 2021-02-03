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
    }

    document.querySelector('#listCam').innerHTML = listCameraHtml;

    let divCam = document.querySelectorAll('figure.camera');
    for (let i = 0; i < divCam.length; i++) {
        let cam = divCam[i];
        cam.addEventListener('click', function () {
            // Lorsque le visiteur click sur le produit on identifie l'id caméra
            let getIdCam = cam.getAttribute("id");
            // Redirection à la page product contenant la description de l'article 
            document.location.href = "html/product.html?&Camera=" + getIdCam;
        });
    }

}).catch(function () {
    // Gestions des erreurs: affiche Error 404
    document.querySelector('#listCam').innerHTML = '<h2 class=\"h1color text-center mb-5 h1 font-weight-normal\">Error 404</h2>';
});