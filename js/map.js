'use strict';

//(function () {
  var offers;
  var mapElement = document.querySelector('.map');

  window.form.syncAddressField();

  window.backend.load(function (loadedOffers) {
    offers = loadedOffers;
    window.pinMain.activate();
  });

  window.map = {
    getOffers: function () {
      return offers;
    },
    activate: function () {
      mapElement.classList.remove('map--faded');
      window.pins.create(window.filter.filterOffers(offers));
    },
    deactivate: function () {
      mapElement.classList.add('map--faded');
      window.pinMain.deactivate();
      window.form.syncAddressField();
      window.pins.remove();
      window.card.remove();
      window.filter.deactivate();
    }
  };
//})();
