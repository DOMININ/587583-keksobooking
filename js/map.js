'use strict';

var offers;

window.form.syncAddressField();

var mapElement = document.querySelector('.map');

window.map = {
  activate: function () {
    mapElement.classList.remove('map--faded');
    window.pins.create(window.filter.activate(offers));
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
