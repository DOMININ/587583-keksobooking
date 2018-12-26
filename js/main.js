'use strict';

(function () {
  var OFFER_LIMIT_MIN = 0;
  var OFFER_LIMIT_MAX = 5;

  var loadedOffers;

  var deactivateApplication = function () {
    window.map.deactivate();
    window.filter.deactivate();
    window.form.deactivate();
    window.formPhoto.deactivate();

    window.pins.remove();
    window.card.remove();

    window.pinMain.resetPosition();

    window.form.setAddressField(
        window.pinMain.getPositionX(),
        window.pinMain.getPositionY()
    );
  };

  var activateApplication = function () {
    window.map.activate();
    window.pins.create(
        loadedOffers.slice(OFFER_LIMIT_MIN, OFFER_LIMIT_MAX),
        onPinClick
    );

    window.filter.activate(loadedOffers, onFilter);
    window.form.activate(onFormSubmit, onFormReset);
    window.formPhoto.activate();
  };

  var onRequestError = function () {
    window.messages.createErrorMessage();
  };

  var onRequestSuccess = function () {
    window.messages.createSuccessMessage();

    deactivateApplication();
  };

  var onFormSubmit = function (data) {
    window.backend.upload(onRequestSuccess, onRequestError, data);
  };

  var onFormReset = function () {
    deactivateApplication();
  };

  var onMainPinMouseUp = function () {
    if (!window.map.isActivated) {
      activateApplication();
    }
  };

  var onMainPinMouseMove = function (x, y) {
    window.form.setAddressField(x, y);
  };

  var onPinClick = function (data) {
    window.card.remove();
    window.card.create(data);
  };

  var onFilter = function (filteredOffers) {
    window.pins.remove();
    window.card.remove();
    window.pins.create(filteredOffers, onPinClick);
  };

  window.form.setAddressField(
      window.pinMain.getPositionX(),
      window.pinMain.getPositionY()
  );

  window.backend.load(function (offers) {
    loadedOffers = offers;
    window.pinMain.activate(onMainPinMouseUp, onMainPinMouseMove);
  });
})();
