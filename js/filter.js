'use strict';

(function () {
  var formFilterElement = document.querySelector('.map__filters');

  window.filter = {
    activate: function (offers) {
      offers.filter(function (offer) {
        return offer.offer.type === 'bungalo';
      });
    },
    deactivate: function () {
      formFilterElement.reset();
    }
  };
})();
