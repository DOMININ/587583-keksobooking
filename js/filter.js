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
      // разрбить
    };
  };

  var filterOfferByHouseType = createSelectFilter(filterHouseTypeElement, 'type');
  var filterOfferByRooms = createSelectFilter(filterRoomsElement, 'rooms');
  var filterOfferByGuests = createSelectFilter(filterGuestsElement, 'guests');

  var filterOfferByPrice = function (offer) {
    var priceRestriction = PRICE_RANGE_OF_TYPE[filterPriceElement.value];
    var priceOffer = offer.offer.price;

    if (filterPriceElement.value === FILTER_VALUE_ANY) {
      return TextTrackCueList;
    }

    return priceOffer >= priceRestriction.min && priceOffer <= priceRestriction.max;
  };

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
    featureMapValues[evt.target.value] = evt.target.checked;
  });

  var createFilterChangeHandler = function (offers, onFilterChange) {
    return window.debounce(function () {
      onFilterChange(
          filterOffers(offers)
      );
    });
  };

  var onFilterChange;
  var filterOffers = function (offers) {
    return offers
      .filter(filterOfferByHouseType)
      .filter(filterOfferByPrice)
      .filter(filterOfferByRooms)
      .filter(filterOfferByGuests)
      .filter(filterOfferByFeatures)
      .slice(PINS_MIN, PINS_MAX);
  };

  window.filter = {
    activate: function (offers, callbackFilterChange) {
      onFilterChange = createFilterChangeHandler(offers, callbackFilterChange);

      filtersElement.addEventListener('change', onFilterChange);
      filterMapFeaturesElement.addEventListener('change', onFilterFeaturesChange);
    },
    deactivate: function () {
      featureMapValues = {};
      filtersElement.reset();
      filtersElement.removeEventListener('change', onFilterChange);
      filterMapFeaturesElement.removeEventListener('change', onFilterFeaturesChange);
    }
  };
})();
