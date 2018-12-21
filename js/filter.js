'use strict';

(function () {
  var PINS_MIN = 0;
  var PINS_MAX = 5;

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

  var createSelectFilter = function (typeElement, offer, type) {
    return typeElement.value === 'any' ? offer : offer.offer[type].toString() === typeElement.value;
  };

  var filterOfferByHouseType = function (offer) {
    return createSelectFilter(filterHouseTypeElement, offer, 'type');
  };

  var filterOfferByPrice = function (offer) {
    var priceType = priceRangeOfType[filterPriceElement.value];
    return filterPriceElement.value === 'any' ? offer : offer.offer.price >= priceType.min && offer.offer.price <= priceType.max;
  };

  var filterOfferByRooms = function (offer) {
    return createSelectFilter(filterRoomsElement, offer, 'rooms');
  };

  var filterOfferByGuests = function (offer) {
    return createSelectFilter(filterGuestsElement, offer, 'guests');
  };

  // var filterOfferByFeatures = function(offer) {
  //   return featureMapValues;
  // };

  var featureMapValues = {};

  var onFilterFeaturesChange = function (evt) {
    var featureName = evt.target.value;
    var featureIsActive = document.querySelector('#filter-' + featureName).checked === true;
    featureMapValues[featureName] = featureIsActive;

    window.pins.remove();
    window.pins.create(window.filter.filterOffers(window.map.getOffers()));
  };

  var onFilterChange = function () {
    window.pins.remove();
    window.card.remove();
    window.pins.create(window.filter.filterOffers(window.map.getOffers()));
  };

  window.filter = {
    filterOffers: function (offers) {
      filterHouseTypeElement.addEventListener('change', onFilterChange);
      filterPriceElement.addEventListener('change', onFilterChange);
      filterRoomsElement.addEventListener('change', onFilterChange);
      filterGuestsElement.addEventListener('change', onFilterChange);

      filterMapFeaturesElement.addEventListener('change', onFilterFeaturesChange);
      return offers
        .filter(filterOfferByHouseType)
        .filter(filterOfferByPrice)
        .filter(filterOfferByRooms)
        .filter(filterOfferByGuests)
        .filter(filterOfferByFeatures)
        .slice(PINS_MIN, PINS_MAX);
    },
    deactivate: function () {
      filterHouseTypeElement.removeEventListener('change', onFilterChange);
      filterPriceElement.removeEventListener('change', onFilterChange);
      filterRoomsElement.removeEventListener('change', onFilterChange);
      filterGuestsElement.removeEventListener('change', onFilterChange);

      filterMapFeaturesElement.removeEventListener('change', onFilterFeaturesChange);
      filterElement.reset();
    }
  };
})();
