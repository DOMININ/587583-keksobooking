'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var mainElement = document.querySelector('main');
  var messageSuccessElement = document.querySelector('#success').content.querySelector('.success');
  var messageErrorElement = document.querySelector('#error').content.querySelector('.error');

  var messageElement;

  var removeMessage = function () {
    mainElement.removeChild(messageElement);

    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onDocumentEscKeydown);

    messageElement = null;
  };

  var createMessage = function (element) {
    return function () {
      if (messageElement) {
        removeMessage();
      }

      messageElement = element;
      mainElement.appendChild(messageElement);

      document.addEventListener('click', onDocumentClick);
      document.addEventListener('keydown', onDocumentEscKeydown);
    };
  };

  var createNetworkErrorMessage = function () {
    return function () {
      if (messageElement) {
        removeMessage();
      }

      var element = messageErrorElement.cloneNode(true);

      element.querySelector('.error__message').textContent = 'Сервис недоступен. Попробуйте позже';
      element.querySelector('.error__button').remove();

      messageElement = element;
      mainElement.appendChild(messageElement);
    };
  };

  var onDocumentClick = function () {
    removeMessage();
  };

  var onDocumentEscKeydown = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      removeMessage();
    }
  };

  window.messages = {
    createSuccessMessage: createMessage(messageSuccessElement),
    createErrorMessage: createMessage(messageErrorElement),
    createNetworkErrorMessage: createNetworkErrorMessage()
  };
})();
