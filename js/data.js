'use strict';

(function () {
  window.createOffers = function () {
    var offers = [];

    window.backend.load(function (pins) {
      for (var i = 0; i < pins.length; i++) {
        offers.push(pins[i]);
      }
    });

    return offers;
  };
})();
