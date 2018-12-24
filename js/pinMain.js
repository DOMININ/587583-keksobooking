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


  var onRequestError = function () {
    // @TODO
    window.messages.createErrorMessage();
  };

  var onRequestSuccess = function () {
    // @TODO
    window.messages.createSuccessMessage();
    window.pinMain.resetPosition();
    window.form.deactivate();
    window.map.deactivate();

    pinMainElement.addEventListener('click', onPinMainClick);
    pinMainElement.addEventListener('mousedown', onPinMainMouseDown);
  };

  var onPinMainClick = function () {
    window.map.activate();
    window.form.activate(onRequestSuccess, onRequestError);

    pinMainElement.removeEventListener('click', onPinMainClick);
  };

  var createPinMainMouseDownHandler = function(callbackMouseMove) {
    return function (mouseDownEvt) {
      mouseDownEvt.preventDefault();

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

        var offsetY = pinMainElement.offsetTop - shiftCoords.y;
        var offsetX = pinMainElement.offsetLeft - shiftCoords.x;

        var y = Math.max(PIN_MIN_Y - PIN_MAIN_HEIGHT, Math.min(offsetY, PIN_MAX_Y - PIN_MAIN_HEIGHT));
        var x = Math.max(PIN_MIN_X, Math.min(offsetX, PIN_MAX_X - PIN_MAIN_WIDTH));

        pinMainElement.style.top = y + 'px';
        pinMainElement.style.left = x + 'px';

        callbackMouseMove(
            x + PIN_MAIN_WIDTH / 2,
            y + PIN_MAIN_HEIGHT
        );
      };

      var onDocumentMouseUp = function (mouseUpEvt) {
        mouseUpEvt.preventDefault();

        document.removeEventListener('mousemove', onDocumentMouseMove);
        document.removeEventListener('mouseup', onDocumentMouseUp);
      };

      document.addEventListener('mousemove', onDocumentMouseMove);
      document.addEventListener('mouseup', onDocumentMouseUp);
    };
  };

  var onPinMainMouseDown;

  window.pinMain = {
    activate: function (callbackMouseMove) {
      onPinMainMouseDown = createPinMainMouseDownHandler(callbackMouseMove);

      pinMainElement.addEventListener('click', onPinMainClick);
      pinMainElement.addEventListener('mousedown', onPinMainMouseDown);
    },
    deactivate: function () {
      pinMainElement.removeEventListener('mousedown', onPinMainMouseDown);
    },
    resetPosition: function () {
      pinMainElement.style.top = PIN_MAIN_Y + 'px';
      pinMainElement.style.left = PIN_MAIN_X + 'px';
    }
  };
})();
