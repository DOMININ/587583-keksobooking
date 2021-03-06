'use strict';

(function () {
  var FILTER_VALUE_ANY = 'any';
  var FILTER_LIMIT_MIN = 0;
  var FILTER_LIMIT_MAX = 5;

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
      if (typeElement.value === FILTER_VALUE_ANY) {
        return true;
      }
      return offer.offer[type].toString() === typeElement.value;
    };
  };

  var filterOfferByHouseType = createSelectFilter(filterHouseTypeElement, 'type');
  var filterOfferByRooms = createSelectFilter(filterRoomsElement, 'rooms');
  var filterOfferByGuests = createSelectFilter(filterGuestsElement, 'guests');

  var filterOfferByPrice = function (offer) {
    var priceRestriction = PRICE_RANGE_OF_TYPE[filterPriceElement.value];
    var priceOffer = offer.offer.price;

    if (filterPriceElement.value === FILTER_VALUE_ANY) {
      return true;
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

  var onFilterFeaturesChange = function (evt) {
    featureMapValues[evt.target.value] = evt.target.checked;
  };

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
      .filter(function (offer) {
        return (
          filterOfferByHouseType(offer) &&
          filterOfferByPrice(offer) &&
          filterOfferByRooms(offer) &&
          filterOfferByGuests(offer) &&
          filterOfferByFeatures(offer)
        );
      })
      .slice(FILTER_LIMIT_MIN, FILTER_LIMIT_MAX);
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
