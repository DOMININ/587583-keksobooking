'use strict';

var pinsElement = document.querySelector('.map__pins');

var offers;

window.form.syncAddressField();

var mapElement = document.querySelector('.map');

window.map = {
  activate: function () {
    mapElement.classList.remove('map--faded');
    window.filter.activate(offers);
    pinsElement.appendChild(window.pins.create(offers));
  },
  deactivate: function () {
    mapElement.classList.add('map--faded');
    window.pinMain.deactivate();
    window.form.syncAddressField();
    window.pins.remove();
    window.cards.remove();
    window.filter.deactivate();
  },
};

window.backend.load(function (loadedOffers) {
  offers = loadedOffers;
  window.pinMain.activate();
});
