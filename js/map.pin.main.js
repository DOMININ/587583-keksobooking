'use strict';

(function () {
  var PIN_MAIN_X = 570;
  var PIN_MAIN_Y = 375;
  var PIN_MIN_X = 0;
  var PIN_MAX_X = 1200;
  var PIN_MIN_Y = 130;
  var PIN_MAX_Y = 630;
  var PIN_MAIN_WIDTH = 62;
  var PIN_MAIN_HEIGHT = 84;

  var pinMainElement = document.querySelector('.map__pin--main');


  var onPinMainMouseDown = function (mouseDownEvt) {
    mouseDownEvt.preventDefault();

    window.form.setAddressFieldValue(window.pinMain.getPositionX(), window.pinMain.getPositionY());

    var startCoords = {
      x: mouseDownEvt.clientX,
      y: mouseDownEvt.clientY
    };

    var onDocumentMouseMove = function (mouseMoveEvt) {
      mouseMoveEvt.preventDefault();

      var shiftCoords = {
        x: startCoords.x - mouseMoveEvt.clientX,
        y: startCoords.y - mouseMoveEvt.clientY
      };

      startCoords = {
        x: mouseMoveEvt.clientX,
        y: mouseMoveEvt.clientY
      };

      var y = pinMainElement.offsetTop - shiftCoords.y;
      var x = pinMainElement.offsetLeft - shiftCoords.x;

      pinMainElement.style.top = Math.max(PIN_MIN_Y - PIN_MAIN_HEIGHT, Math.min(y, PIN_MAX_Y - PIN_MAIN_HEIGHT)) + 'px';
      pinMainElement.style.left = Math.max(PIN_MIN_X, Math.min(x, PIN_MAX_X - PIN_MAIN_WIDTH)) + 'px';

      window.form.setAddressFieldValue(window.pinMain.getPositionX(), window.pinMain.getPositionY());
    };

    var onDocumentMouseUp = function (mouseUpEvt) {
      mouseUpEvt.preventDefault();

      document.removeEventListener('mousemove', onDocumentMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
    };

    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  };

  var onFormError = function () {
    window.messages.createErrorMessage();
  };

  var onFormSuccess = function () {
    window.messages.createSuccessMessage();
    window.pinMain.resetPosition();
    window.form.deactivate();
    window.map.deactivate();
  };

  var onPinMainClick = function () {
    window.map.activate();
    window.form.activate(onFormSuccess, onFormError);

    pinMainElement.removeEventListener('click', onPinMainClick);
  };

  window.pinMain = {
    activate: function () {
      pinMainElement.addEventListener('click', onPinMainClick);
      pinMainElement.addEventListener('mousedown', onPinMainMouseDown);
    },
    deactivate: function () {
      pinMainElement.addEventListener('click', onPinMainClick);
    },
    resetPosition: function () {
      pinMainElement.style.top = PIN_MAIN_Y + 'px';
      pinMainElement.style.left = PIN_MAIN_X + 'px';
    },
    getPositionX: function () {
      return parseInt(pinMainElement.style.left, 10) + PIN_MAIN_WIDTH / 2;
    },
    getPositionY: function () {
      return parseInt(pinMainElement.style.top, 10) + PIN_MAIN_HEIGHT;
    }
  };
})();
