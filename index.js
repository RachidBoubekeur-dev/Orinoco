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

let getCamera = function (id) {
    return getXhr('http://localhost:3000/api/cameras/' + id).then(function (response) {
        let camera = JSON.parse(response);
        return camera;
    });
};

let listCam = document.querySelector('#listCam');
let pageCam = document.querySelector('#pageCam');
let quantityCam = document.querySelector('#quantityCam');
let closePageCam = document.querySelector('#closePageCam');

getListCamera().then(function (listCamera) {

    let listCameraHtml = "";
    for (let i = 0; i < listCamera.length; i++) {

        let price = listCamera[i].price;
        price = price.toString();

        let newPrice = price.substr(0, 3);

        if (price.length === 6) {
            newPrice += "," + price.substr(3, 2);
        }

        listCameraHtml += "<div class=\"col mb-5\"><figure id=\"" + listCamera[i]._id + "\" class=\"camera card\"><div class=\"prixcard\"><span>" + newPrice + "€</span></div><img src=\"" + listCamera[i].imageUrl + "\" class=\"card-img-top\" alt=\"Caméra " + listCamera[i].name + "\"><figcaption class=\"card-body\"><h5 class=\"card-title\">" + listCamera[i].name + "</h5><span class=\"h1color\">Voir la description</span></figcaption></figure></div>";
    };

    document.querySelector('#listCam').innerHTML = listCameraHtml;

    functionDivCam();

}).catch(function () {
    document.querySelector('#listCam').innerHTML = '<h2 class=\"h1color text-center mb-5 h1\">Error 404</h2>';
});

let functionDivCam = function () {
    let divCam = document.querySelectorAll('figure.camera');
    for (let i = 0; i < divCam.length; i++) {
        let cam = divCam[i];
        cam.addEventListener('click', function () {
            let getIdCam = cam.getAttribute("id");
            getCamera(getIdCam).then(function (camera) {

                let price = camera.price;
                price = price.toString();

                let newPrice = price.substr(0, 3);

                if (price.length === 6) {
                    newPrice += "," + price.substr(3, 2);
                }

                for (let y = 0; y < camera.lenses.length; y++) {
                    let optionLense = document.createElement("option");
                    optionLense.innerHTML = camera.lenses[y];
                    optionLense.setAttribute("id", "optionLense");
                    document.querySelector('#lensesCam').appendChild(optionLense);
                }

                document.querySelector('#imageCam').setAttribute("src", camera.imageUrl);
                document.querySelector('#imageCam').setAttribute("alt", "Caméra " + camera.name);
                document.querySelector('#nameCam').innerHTML = camera.name;
                document.querySelector('#descriptionCam').innerHTML = camera.description;
                document.querySelector('#priceCam').innerHTML = newPrice + "€";
                document.querySelector('.ajoutPanier').setAttribute("id", camera._id);
                quantityCam.value = 1;
                listCam.style.opacity = 0;
                setTimeout(function () { listCam.style.display = "none"; }, 60);
                pageCam.style.display = "flex";
                setTimeout(function () { pageCam.style.opacity = 1; }, 60);

            }).catch(function () {
                document.querySelector('#listCam').innerHTML = '<h2 class=\"h1color text-center mb-5 h1\">Error 404</h2>';
            });
        });
    }
};

let functionClosePageCam = function () {
    let optionsLenses = document.querySelectorAll("option#optionLense");

    for (let i = 0; i < optionsLenses.length; i++) {
        document.querySelector("#optionLense").remove();
    }

    document.querySelector(".ajoutPanier").removeAttribute('id');
    pageCam.style.opacity = 0;
    setTimeout(function () { pageCam.style.display = "none"; }, 200);
    listCam.style.display = "flex";
    setTimeout(function () { listCam.style.opacity = 1; }, 200);
}

let ajoutPanier = document.querySelector('.ajoutPanier');

ajoutPanier.addEventListener('click', function () {
    let optionCam = document.querySelector("#lensesCam").value;
    let idPanier = ajoutPanier.getAttribute("id");
    getCamera(idPanier).then(function (camera) {

        for (let i = 0; i < quantityCam.value; i++) {
            let numberPanier = "Panier " + localStorage.length;
            let lensesPanier = "Lense " + camera._id;
            localStorage.setItem(numberPanier, camera._id);
            localStorage.setItem(lensesPanier, optionCam);
        }

        functionClosePageCam();

        let infoPanier = document.querySelector("#infoPanier");
        let closeInfoPanier = document.querySelector("#closeInfoPanier");
        let textInfoPanier = document.querySelector("#textInfoPanier");

        if (quantityCam.value > 1) {
            textInfoPanier.innerHTML = quantityCam.value + " Caméra " + camera.name + " ajoutez au panier";
        } else {
            textInfoPanier.innerHTML = "Caméra " + camera.name + " ajoutez au panier";
        }

        infoPanier.style.display = "block";
        setTimeout(function () { infoPanier.style.opacity = 1; }, 60);
        setTimeout(function () { infoPanier.style.opacity = 0; }, 3500);
        setTimeout(function () { infoPanier.style.display = "none"; }, 4100);

        closeInfoPanier.addEventListener('click', function (e) {
            e.preventDefault();
            infoPanier.style.opacity = 0;
            setTimeout(function () { infoPanier.style.display = "none"; }, 3 - 0);
        });


    }).catch(function () {
        document.querySelector('#listCam').innerHTML = '<h2 class=\"h1color text-center mb-5 h1\">Error 404</h2>';
    });
});

closePageCam.addEventListener('click', function () {
    functionClosePageCam();
});