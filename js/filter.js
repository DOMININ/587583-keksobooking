'use strict';

(function () {
  var filterElement = document.querySelector('.map__filters');
  var filterHousePriceElement = document.querySelector('#housing-price');
  var filterHouseTypeElement = document.querySelector('#housing-type');
  //

  var filterMapFeaturesElement = document.querySelector('.map__features');


  var filterOfferByHouseType = function(element, index, array) {
    // offers.filter
    return true
  }
  
  var filterOffers = function(offers) {
    return offers
      .filter(filterOfferByHouseType)
  }

  var onFilterHouseTypeChange = function () {
    window.pins.remove()
    window.pins.create(filterOffers(window.map.getOffers())) // ?
  };

  window.filter = {
    activate: function (offers) {
      filterHouseTypeElement.addEventListener('change', onFilterHouseTypeChange);
    },
    deactivate: function () {
      filterHouseTypeElement.removeEventListener('change', onFilterHouseTypeChange);
      filterElement.reset();
    }
  };
})();
