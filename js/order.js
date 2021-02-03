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