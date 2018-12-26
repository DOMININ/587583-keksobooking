'use strict';

(function () {
  var OFFER_LIMIT_MIN = 0;
  var OFFER_LIMIT_MAX = 5;

  var loadedOffers;
  var mapElement = document.querySelector('.map');

  var onRequestError = function () {
    window.messages.createErrorMessage();
  };

  var onRequestSuccess = function () {
    window.messages.createSuccessMessage();
    window.form.deactivate();
    window.map.deactivate();
  };

  var onFormSubmit = function (data) {
    window.backend.upload(onRequestSuccess, onRequestError, data);
  };

  var onFormReset = function () {
    window.map.deactivate();
    window.form.deactivate();
    window.pinMain.resetPosition();
  };

  var onMainPinMouseUp = function () {
    if (!mapIsActive) {
      window.map.activate();
      window.form.activate(onFormSubmit, onFormReset);
    }
  };

  var onMainPinMouseMove = function (x, y) {
    window.form.setAddressField(x, y);
  };

  window.form.setAddressField(
      window.pinMain.getPositionX(),
      window.pinMain.getPositionY()
  );

  window.backend.load(function (offers) {
    loadedOffers = offers;
    window.pinMain.activate(onMainPinMouseUp, onMainPinMouseMove);
  });

  var onPinClick = function (data) {
    window.card.remove();
    window.card.create(data);
  };

  var onFilter = function (filteredOffers) {
    window.pins.remove();
    window.card.remove();
    window.pins.create(filteredOffers, onPinClick);
  };

  var mapIsActive = false;

  window.map = {
    activate: function () {
      mapIsActive = true;
      mapElement.classList.remove('map--faded');

      window.pins.create(
          loadedOffers.slice(OFFER_LIMIT_MIN, OFFER_LIMIT_MAX),
          onPinClick
      );

      window.filter.activate(loadedOffers, onFilter);

      window.formPhoto.activate();
    },
    deactivate: function () {
      mapIsActive = false;
      mapElement.classList.add('map--faded');

      window.form.setAddressField(
          window.pinMain.getPositionX(),
          window.pinMain.getPositionY()
      );

      window.pins.remove();
      window.card.remove();
      window.filter.deactivate();
      window.formPhoto.deactivate();
    }
  };
})();
