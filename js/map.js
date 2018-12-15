'use strict';

var pinsElement = document.querySelector('.map__pins');

var offers;

window.form.syncAddressField();

var mapElement = document.querySelector('.map');

window.map = {
  activate: function () {
    mapElement.classList.remove('map--faded');
    pinsElement.appendChild(window.pins.create(offers));
  },
  deactivate: function () {
    mapElement.classList.add('map--faded');
    window.pinMain.deactivate();
    window.form.syncAddressField();
    window.pins.remove();
  },
};

window.backend.load(function (loadedOffers) {
  offers = loadedOffers;
  window.pinMain.activate();
});
