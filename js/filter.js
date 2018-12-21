'use strict';

(function () {
  var FILTER_VALUE_ANY = 'any';

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

  var filtersElement = document.querySelector('.map__filters');
  var filterHouseTypeElement = document.querySelector('#housing-type');
  var filterPriceElement = document.querySelector('#housing-price');
  var filterRoomsElement = document.querySelector('#housing-rooms');
  var filterGuestsElement = document.querySelector('#housing-guests');

  var filterMapFeaturesElement = document.querySelector('.map__features');

  var createSelectFilter = function (typeElement, type) {
    return function (offer) {
      return typeElement.value === FILTER_VALUE_ANY ? offer : offer.offer[type].toString() === typeElement.value;
    };
  };

  var filterOfferByHouseType = createSelectFilter(filterHouseTypeElement, 'type');

  var filterOfferByPrice = function (offer) {
    var priceType = PRICE_RANGE_OF_TYPE[filterPriceElement.value];
    return filterPriceElement.value === FILTER_VALUE_ANY ? offer : offer.offer.price >= priceType.min && offer.offer.price <= priceType.max;
  };

  var filterOfferByRooms = createSelectFilter(filterRoomsElement, 'rooms');

  var filterOfferByGuests = createSelectFilter(filterGuestsElement, 'guests');

  var filterOfferByFeatures = function (offer) {
    return Object.keys(featureMapValues).reduce(function (isValid, feature) {
      if (featureMapValues[feature]) {
        return isValid && offer.offer.features.indexOf(feature) !== -1;
      }
      return isValid;
    }, true);
  };

  var featureMapValues = {};

  var onFilterFeaturesChange = window.debounce(function (evt) {
    var featureName = evt.target.value;
    var featureIsActive = document.querySelector('#filter-' + featureName).checked === true;
    featureMapValues[featureName] = featureIsActive;
  });

  var onFilterChange = window.debounce(function () {
    window.pins.remove();
    window.card.remove();
    window.pins.create(window.filter.filterOffers(window.map.getOffers()));
  });

  window.filter = {
    filterOffers: function (offers) {
      filtersElement.addEventListener('change', onFilterChange);
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
      filtersElement.removeEventListener('change', onFilterChange);
      filterMapFeaturesElement.removeEventListener('change', onFilterFeaturesChange);
      filtersElement.reset();
      featureMapValues = {};
    }
  };
})();
