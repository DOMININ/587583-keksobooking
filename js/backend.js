'use strict';

(function () {
  var METHOD_GET = 'GET';
  var METHOD_POST = 'POST';
  var URL_GET = 'https://js.dump.academy/keksobooking/data';
  var URL_POST = 'https://js.dump.academy/keksobooking';
  var TEXT_STATUS = 'Cтатус ответа: {status} {statusText}';
  var TEXT_ERROR = 'Произошла ошибка соединения';
  var TEXT_TIMEOUT = 'Запрос не успел выполниться за {timeout} мс';

  var STATUS_SUCCESS = 200;
  var TIMEOUT_TIME = 10000;
  var RESPONSE_TYPE = 'json';

  var createRequest = function (method, url, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = RESPONSE_TYPE;

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_SUCCESS) {
        onLoad(xhr.response);
      } else {
        onError(
            TEXT_STATUS
            .replace('{status}', xhr.status)
            .replace('{statusText}', xhr.statusText)
        );
      }
    });

    xhr.addEventListener('error', function () {
      onError(TEXT_ERROR);
    });

    xhr.addEventListener('timeout', function () {
      onError(TEXT_TIMEOUT.replace('{timeout}', xhr.timeout));
    });

    xhr.timeout = TIMEOUT_TIME;

    xhr.open(method, url);
    xhr.send(data);
  };

  window.backend = {
    load: function (onLoad, onError) {
      createRequest(METHOD_GET, URL_GET, onLoad, onError);
    },
    upload: function (onLoad, onError, data) {
      createRequest(METHOD_POST, URL_POST, onLoad, onError, data);
    }
  };
})();
