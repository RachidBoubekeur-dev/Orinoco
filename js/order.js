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

// Récuperation de la commande et du prix total
let dataOrder = localStorage.getItem('Order');
let priceOrder = localStorage.getItem('priceOrder');

postOrder(dataOrder).then(function (order) {
    // Affichage du numéro de commende renvoyer par le serveur et un remerciement au client
    document.querySelector('#orderId').innerHTML = "#" + order.orderId;
    document.querySelector('#orderPrice').innerHTML = "Merci de votre commande de " + priceOrder + ",<br/>a très bientôt chez Oricono.";
    // Effaçage de toutes les données de localStorage
    localStorage.clear();
}).catch(function () {
    // Gestions des erreurs: redirection vers la page d'accueil
    document.location.href = "../index.html";
});