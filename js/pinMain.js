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

  var createPinMainMouseDownHandler = function (onMainPinMouseUp, onMainPinMouseMove) {
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

        onMainPinMouseMove(x + PIN_MAIN_WIDTH / 2, y + PIN_MAIN_HEIGHT);
      };

      var onDocumentMouseUp = function (mouseUpEvt) {
        mouseUpEvt.preventDefault();

        onMainPinMouseUp();

        document.removeEventListener('mousemove', onDocumentMouseMove);
        document.removeEventListener('mouseup', onDocumentMouseUp);
      };

      document.addEventListener('mousemove', onDocumentMouseMove);
      document.addEventListener('mouseup', onDocumentMouseUp);
    };
  };

  var onPinMainMouseDown;

  window.pinMain = {
    activate: function (onMainPinMouseUp, onMainPinMouseMove) {
      onPinMainMouseDown = createPinMainMouseDownHandler(onMainPinMouseUp, onMainPinMouseMove);
      pinMainElement.addEventListener('mousedown', onPinMainMouseDown);
    },
    getPositionX: function () {
      return PIN_MAIN_X + PIN_MAIN_WIDTH / 2;
    },
    getPositionY: function () {
      return PIN_MAIN_Y + PIN_MAIN_HEIGHT;
    },
    resetPosition: function () {
      pinMainElement.style.left = PIN_MAIN_X + 'px';
      pinMainElement.style.top = PIN_MAIN_Y + 'px';
    }
  };
})();
