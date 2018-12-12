'use strict';

// 1. extract selectors
// 2. setTimeout remove dom elemnt

/*
3.3. При успешной отправке формы, форма редактирования изображения закрывается, все данные, введённые в форму и контрол фильтра, приходят в исходное состояние. Поле загрузки фотографии, стилизованное под букву «О» в логотипе, очищается.

На экран выводится сообщение об успешной загрузке изображения. Разметку сообщения, которая находится блоке #success внутри шаблона template, нужно разместить в main. Сообщение должно исчезать после нажатия на кнопку .success__button, по нажатию на клавишу Esc и по клику на произвольную область экрана.

3.4. Если при отправке данных произошла ошибка запроса, нужно показать соответствующее сообщение. Разметку сообщения, которая находится блоке #error внутри шаблона template, нужно разместить в main. Сообщение должно исчезать после нажатия на кнопки .error__button, по нажатию на клавишу Esc и по клику на произвольную область экрана.
*/

(function () {
  window.messages = {
    createSuccessMessage: function () {
      var mainElement = document.querySelector('main');
      var popupSuccessElement = document.querySelector('#success').content.querySelector('.success');

      mainElement.appendChild(popupSuccessElement);
    },
    createErrorMessage: function () {
      var mainElement = document.querySelector('main');
      var popupErrorElement = document.querySelector('#error').content.querySelector('.error');

      mainElement.appendChild(popupErrorElement);
    }
  };
})();
