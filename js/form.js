'use strict';

(function () {
  var TEXT_ERROR_CAPACITY = 'Измените значение поля';

  var COLOR_GRAY = '#d9d9d3';
  var COLOR_RED = 'red';

  var OfferPrices = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };

  var ValidationCapacityMap = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0']
  };

  var syncTypePriceFields = function () {
    var priceValue = OfferPrices[fieldTypeElement.value];

    fieldPriceElement.setAttribute('min', priceValue);
    fieldPriceElement.setAttribute('placeholder', priceValue);
  };

  var onFieldTypeChange = function () {
    syncTypePriceFields();
  };

  var onFieldTimeInChange = function (evt) {
    fieldTimeOutElement.value = evt.target.value;
  };

  var onFieldTimeOutChange = function (evt) {
    fieldTimeInElement.value = evt.target.value;
  };

  var onFieldRoomNumberChange = function (evt) {
    var roomNumberValue = evt.target.value;
    var capacityValues = ValidationCapacityMap[roomNumberValue];

    Array.prototype.forEach.call(fieldCapacityElement.options, function (optionElement) {
      if (capacityValues.indexOf(optionElement.value) === -1) {
        optionElement.setAttribute('disabled', '');
      } else {
        optionElement.removeAttribute('disabled');
      }
    });
  };

  var onFormChange = function (evt) {
    var fieldRoomNumberValue = fieldRoomNumberElement.value;
    var fieldCapacityValue = fieldCapacityElement.value;
    var capacityValues = ValidationCapacityMap[fieldRoomNumberValue];
    var validityMessage = capacityValues.indexOf(fieldCapacityValue) === -1 ? TEXT_ERROR_CAPACITY : '';

    fieldCapacityElement.setCustomValidity(validityMessage);

    evt.target.style.borderColor = evt.target.checkValidity() ? COLOR_GRAY : COLOR_RED;
  };

  var formElement = document.querySelector('.ad-form');
  var formFieldsetElements = document.querySelectorAll('fieldset');
  var formSelectElements = document.querySelectorAll('select');
  var formButtonSubmitElement = document.querySelector('.ad-form__submit');

  var fieldTimeInElement = document.querySelector('#timein');
  var fieldTimeOutElement = document.querySelector('#timeout');
  var fieldTypeElement = document.querySelector('#type');
  var fieldPriceElement = document.querySelector('#price');
  var fieldRoomNumberElement = document.querySelector('#room_number');
  var fieldCapacityElement = document.querySelector('#capacity');
  var fieldAddressElement = document.querySelector('#address');

  var inputsRequiredElements = document.querySelectorAll('.ad-form input:required');

  var addDisableAttribute = function (element) {
    element.setAttribute('disabled', '');
  };

  var removeDisableAttribute = function (element) {
    element.removeAttribute('disabled');
  };

  var setElementBorderColor = function (element) {
    element.style.borderColor = element.checkValidity() === false ? COLOR_RED : COLOR_GRAY;
  };

  var resetInputBorderColor = function () {
    inputsRequiredElements.forEach(function (input) {
      input.style.borderColor = COLOR_GRAY;
    });
  };

  var onButtonSubmitClick = function () {
    inputsRequiredElements.forEach(setElementBorderColor);
  };

  formFieldsetElements.forEach(addDisableAttribute);
  formSelectElements.forEach(addDisableAttribute);

  var createFormSubmitHandler = function (cb) {
    return function (evt) {
      cb(new FormData(formElement));
      evt.preventDefault();
    };
  };

  var createFormResetHandler = function (cb) {
    return function () {
      setTimeout(function () {
        cb();
      });
    };
  };

  var disableElements = function (elements) {
    elements.forEach(removeDisableAttribute);
  };

  var resolveElements = function (elements) {
    elements.forEach(addDisableAttribute);
  };

  var onFormSubmit;
  var onFormReset;

  syncTypePriceFields();

  window.form = {
    activate: function (callbackFormSubmit, callbackFormReset) {

      onFormSubmit = createFormSubmitHandler(callbackFormSubmit);
      onFormReset = createFormResetHandler(callbackFormReset);

      formElement.classList.remove('ad-form--disabled');

      disableElements(formFieldsetElements);
      disableElements(formSelectElements);

      fieldTypeElement.addEventListener('change', onFieldTypeChange);
      fieldTimeInElement.addEventListener('change', onFieldTimeInChange);
      fieldTimeOutElement.addEventListener('change', onFieldTimeOutChange);
      fieldRoomNumberElement.addEventListener('change', onFieldRoomNumberChange);

      formElement.addEventListener('change', onFormChange);
      formElement.addEventListener('submit', onFormSubmit);
      formElement.addEventListener('reset', onFormReset);

      formButtonSubmitElement.addEventListener('click', onButtonSubmitClick);
    },
    deactivate: function () {
      resetInputBorderColor();

      resolveElements(formFieldsetElements);
      resolveElements(formSelectElements);

      formElement.classList.add('ad-form--disabled');
      formElement.reset();
      formElement.removeEventListener('change', onFormChange);
      formElement.removeEventListener('submit', onFormSubmit);
      formElement.removeEventListener('reset', onFormReset);

      fieldTypeElement.removeEventListener('change', onFieldTypeChange);
      fieldTimeInElement.removeEventListener('change', onFieldTimeInChange);
      fieldTimeOutElement.removeEventListener('change', onFieldTimeOutChange);
      fieldRoomNumberElement.removeEventListener('change', onFieldRoomNumberChange);

      formButtonSubmitElement.removeEventListener('click', onButtonSubmitClick);
    },
    setAddressField: function (x, y) {
      fieldAddressElement.value = x + ', ' + y;
    },
  };
})();
