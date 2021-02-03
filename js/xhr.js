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

let postXhr = function (url, dataOrder) {
    return new Promise(function (resolve, reject) {

        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 201) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr);
                }
            }
        }

        xhr.open('POST', url);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(dataOrder);
    });
};

// Envoie la commande
let postOrder = function (dataOrder) {
    return postXhr('http://localhost:3000/api/cameras/order', dataOrder).then(function (response) {
        let order = JSON.parse(response);
        return order;
    });
};

// Demande la liste des caméras
let getListCamera = function () {
    return getXhr('http://localhost:3000/api/cameras').then(function (response) {
        let listCamera = JSON.parse(response);
        return listCamera;
    });
};

// Demande les infos de la caméras
let getCamera = function (id) {
    return getXhr('http://localhost:3000/api/cameras/' + id).then(function (response) {
        let camera = JSON.parse(response);
        return camera;
    });
};