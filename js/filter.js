'use strict';

(function () {
  var filterElement = document.querySelector('.map__filters');
  var filterHouseTypeElement = document.querySelector('#housing-type');
  var filterPriceElement = document.querySelector('#housing-price');
  var filterRoomsElement = document.querySelector('#housing-rooms');
  var filterGuestsElement = document.querySelector('#housing-guests');

  var filterMapFeaturesElement = document.querySelector('.map__features');

  var priceRangeOfType = {
    middle: {
      min: 10000,
      max: 50000
    },
    low: {
      min: 0,
      max: 10000
    },
    high: {
      min: 50000,
      max: Infinity
    }
  };

  var filterOfferByHouseType = function (offers) {
    return filterHouseTypeElement.value === 'any' ? offers : offers.offer.type === filterHouseTypeElement.value;
  };

  var filterOfferByPrice = function (offers) {
    var priceType = priceRangeOfType[filterPriceElement.value];
    return filterPriceElement.value === 'any' ? offers : offers.offer.price >= priceType.min && offers.offer.price <= priceType.max;
  };

  var filterOfferByRooms = function (offers) {
    return filterRoomsElement.value === 'any' ? offers : offers.offer.rooms.toString() === filterRoomsElement.value;
  };

  var filterOfferByGuests = function (offers) {
    return filterGuestsElement.value === 'any' ? offers : offers.offer.guests.toString() === filterGuestsElement.value;
  };

  //  var filterOfferByFeatures = function(offer) {
  //    featureMapValues
  //  };
  //
  // var featureMapValues = {}
  //
  // var onFilterFeaturesChange = function (evt) {
  //   var featureName = evt.target.value;
  //   var featureIsActive = /* @TODO: input checked*/
  //   featureMapValues[featureName] = featureIsActive;
  //
  //
  //   window.pins.remove();
  //   window.pins.create(window.filter.filterOffers(window.map.getOffers()));
  // };

  var onFilterChange = function () {
    window.pins.remove();
    window.cards.remove();
    window.pins.create(window.filter.filterOffers(window.map.getOffers()));
  };

  window.filter = {
    filterOffers: function (offers) {
      filterHouseTypeElement.addEventListener('change', onFilterChange);
      filterPriceElement.addEventListener('change', onFilterChange);
      filterRoomsElement.addEventListener('change', onFilterChange);
      filterGuestsElement.addEventListener('change', onFilterChange);

      //filterMapFeaturesElement.addEventListener('change', onFilterFeaturesChange);
      return offers
        .filter(filterOfferByHouseType)
        .filter(filterOfferByPrice)
        .filter(filterOfferByRooms)
        .filter(filterOfferByGuests);
        //.filter(filterOfferByFeatures)
    },
    deactivate: function () {
      filterHouseTypeElement.removeEventListener('change', onFilterChange);
      filterPriceElement.removeEventListener('change', onFilterChange);
      filterRoomsElement.removeEventListener('change', onFilterChange);
      filterGuestsElement.removeEventListener('change', onFilterChange);

      //filterMapFeaturesElement.removeEventListener('change', onFilterFeaturesChange);
      filterElement.reset();
    }
  };
})();
