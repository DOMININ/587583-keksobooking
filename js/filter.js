'use strict';

(function () {
  var PINS_MIN = 0;
  var PINS_MAX = 5;

  var PRICE_RANGE_OF_TYPE = {
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

  var filterElement = document.querySelector('.map__filters');
  var filterHouseTypeElement = document.querySelector('#housing-type');
  var filterPriceElement = document.querySelector('#housing-price');
  var filterRoomsElement = document.querySelector('#housing-rooms');
  var filterGuestsElement = document.querySelector('#housing-guests');

  var filterMapFeaturesElement = document.querySelector('.map__features');

  var createSelectFilter = function (typeElement, type) {
    return function (offer) {
      return typeElement.value === 'any' ? offer : offer.offer[type].toString() === typeElement.value;
    };
  };

  var filterOfferByHouseType = createSelectFilter(filterHouseTypeElement, 'type');

  var filterOfferByPrice = function (offer) {
    var priceType = PRICE_RANGE_OF_TYPE[filterPriceElement.value];
    return filterPriceElement.value === 'any' ? offer : offer.offer.price >= priceType.min && offer.offer.price <= priceType.max;
  };

  var filterOfferByRooms = createSelectFilter(filterRoomsElement, 'rooms');

  var filterOfferByGuests = createSelectFilter(filterGuestsElement, 'guests');

  var filterOfferByFeatures = function (offer) {
    var isValid = Object.keys(featureMapValues).reduce(function (valid, feature) {
      if (featureMapValues[feature]) {
        return valid && offer.offer.features.indexOf(feature) !== -1;
      }
      return valid;
    }, true);
    return isValid;
  };

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
      filterElement.addEventListener('change', onFilterChange);
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
      filterElement.removeEventListener('change', onFilterChange);
      filterMapFeaturesElement.removeEventListener('change', onFilterFeaturesChange);
      filterElement.reset();
    }
  };
})();
