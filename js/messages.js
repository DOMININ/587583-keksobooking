'use strict';

(function () {
  var KEYCODE_ESC = 27;

  var mainElement = document.querySelector('main');
  var popupSuccessElement = document.querySelector('#success').content.querySelector('.success');
  var popupErrorElement = document.querySelector('#error').content.querySelector('.error');

  var onPopupSuccessEscKeydown = function (evt) {
    if (evt.keyCode === KEYCODE_ESC) {
      mainElement.removeChild(popupSuccessElement);
      document.removeEventListener('click', onPopupSuccessClick);
      document.removeEventListener('keydown', onPopupSuccessEscKeydown);
    }
  };

  var onPopupErrorEscKeydown = function (evt) {
    if (evt.keyCode === KEYCODE_ESC) {
      mainElement.removeChild(popupErrorElement);
      document.removeEventListener('click', onPopupSuccessClick);
      document.removeEventListener('keydown', onPopupSuccessEscKeydown);
    }
  };

  var onPopupSuccessClick = function () {
    mainElement.removeChild(popupSuccessElement);
    document.removeEventListener('click', onPopupSuccessClick);
    document.removeEventListener('keydown', onPopupSuccessEscKeydown);
  };

  var onPopupErrorClick = function () {
    mainElement.removeChild(popupErrorElement);
    document.removeEventListener('click', onPopupSuccessClick);
    document.removeEventListener('keydown', onPopupSuccessEscKeydown);
  };

  window.messages = {
    createSuccessMessage: function () {
      mainElement.appendChild(popupSuccessElement);

      document.addEventListener('click', onPopupSuccessClick);
      document.addEventListener('keydown', onPopupSuccessEscKeydown);
    },
    createErrorMessage: function () {
      mainElement.appendChild(popupErrorElement);

      document.addEventListener('click', onPopupErrorClick);
      document.addEventListener('keydown', onPopupErrorEscKeydown);
    }
  };
})();
