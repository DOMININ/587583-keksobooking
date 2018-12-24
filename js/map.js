'use strict';

(function () {
  var offers;

  var mapElement = document.querySelector('.map');

  var onFormUploadSuccess = function () {
    window.messages.createSuccessMessage();
  };

  var onFormUploadError = function () {
    window.messages.createErrorMessage();
  };

  var onFormSubmit = function (data) {
    window.backend.upload(onFormUploadSuccess, onFormUploadError, data);
  };

  var onFormReset = function () {
    // @TODO
    window.form.deactivate();
    window.map.deactivate();
    window.pinMain.resetPosition();
    window.pinMain.activate();
  };

  var onPinMainMouseMove = function (x, y) {
    window.form.setAddressField(x, y);
    window.form.activate(onFormSubmit, onFormReset);
  };

  var onLoadSuccess = function (loadedOffers) {
    offers = loadedOffers;

    window.pinMain.activate(onPinMainMouseMove);
  };

  window.backend.load(onLoadSuccess);

  window.map = {
    getOffers: function () {
      return offers;
    },
    activate: function () {
      mapElement.classList.remove('map--faded');

      window.pins.create(window.filter.filterOffers(offers));
      window.formPhoto.activate();
    },
    deactivate: function () {
      mapElement.classList.add('map--faded');
      window.pinMain.deactivate();
      window.form.setAddressField();
      window.pins.remove();
      window.card.remove();
      window.filter.deactivate();
      window.formPhoto.deactivate();
    }
  };
})();
