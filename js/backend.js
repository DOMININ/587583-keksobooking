'use strict';

(function () {
  var GET_METHOD = 'GET';
  var GET_URL = 'https://js.dump.academy/keksobooking/data';

  var POST_METHOD = 'POST';
  var POST_URL = 'https://js.dump.academy/keksobooking';

  var TEXT_ERROR_STATUS = 'Cтатус ответа: {status} {statusText}';
  var TEXT_ERROR = 'Произошла ошибка соединения';
  var TEXT_TIMEOUT = 'Запрос не успел выполниться за {timeout} мс';

  var statusSuccess = 200;
  var timeoutTime = 10000;

  var receiveData = function (method, url, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === statusSuccess) {
        onLoad(xhr.response);
      } else {
        onError(TEXT_ERROR_STATUS.replace('{status}', xhr.status).replace('{statusText}', xhr.statusText));
      }
    });

    xhr.addEventListener('error', function () {
      onError(TEXT_ERROR);
    });

    xhr.addEventListener('timeout', function () {
      onError(TEXT_TIMEOUT.replace('{timeout}', xhr.timeout));
    });

    xhr.timeout = timeoutTime;

    xhr.open(method, url);

    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) {
      receiveData(GET_METHOD, GET_URL, onLoad, onError).send();
    },
    upload: function (onLoad, onError, data) {
      receiveData(POST_METHOD, POST_URL, onLoad, onError).send(data);
    }
  };
})();
