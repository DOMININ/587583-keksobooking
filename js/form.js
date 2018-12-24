'use strict';

(function () {
  var TEXT_ERROR_CAPACITY = 'Измените значение поля';

  var OFFER_PRICES = {
    palace: '10000',
    flat: '1000',
    house: '5000',
    bungalo: '0'
  };

  var VALIDATION_CAPACITY_MAP = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0']
  };

  var onFieldTypeChange = function (evt) {
    var typeValue = evt.target.value;
    var priceValue = OFFER_PRICES[typeValue];

    fieldPriceElement.setAttribute('min', priceValue);
    fieldPriceElement.setAttribute('placeholder', priceValue);
  };

  var onFieldTimeInChange = function (evt) {
    fieldTimeOutElement.value = evt.target.value;
  };

  var onFieldTimeOutChange = function (evt) {
    fieldTimeInElement.value = evt.target.value;
  };

  var onFieldRoomNumberChange = function (evt) {
    var roomNumberValue = evt.target.value;
    var capacityValues = VALIDATION_CAPACITY_MAP[roomNumberValue];

    Array.prototype.forEach.call(fieldCapacityElement.options, function (optionElement) {
      if (capacityValues.indexOf(optionElement.value) === -1) {
        optionElement.setAttribute('disabled', '');
      } else {
        optionElement.removeAttribute('disabled');
      }
    });
  };

  var onFormChange = function () {
    var fieldRoomNumberValue = fieldRoomNumberElement.value;
    var fieldCapacityValue = fieldCapacityElement.value;
    var capacityValues = VALIDATION_CAPACITY_MAP[fieldRoomNumberValue];
    var validityMessage = capacityValues.indexOf(fieldCapacityValue) === -1 ? TEXT_ERROR_CAPACITY : '';

    fieldCapacityElement.setCustomValidity(validityMessage);
  };

  // делегирование
  /*var onFormChange = function (evt) {
    if (evt.target.checkValidity()) {
      // valid - remove red border
    } else {
      // invalid - add red border
    }
  };*/

  var formElement = document.querySelector('.ad-form');
  var formFieldsetElements = document.querySelectorAll('fieldset');
  var formSelectElements = document.querySelectorAll('select');

  var fieldTimeInElement = document.querySelector('#timein');
  var fieldTimeOutElement = document.querySelector('#timeout');
  var fieldTypeElement = document.querySelector('#type');
  var fieldPriceElement = document.querySelector('#price');
  var fieldRoomNumberElement = document.querySelector('#room_number');
  var fieldCapacityElement = document.querySelector('#capacity');
  var fieldAddressElement = document.querySelector('#address');


  var setDisableAttributeForElements = function (elements) {
    Array.prototype.forEach.call(elements, function (element) {
      element.setAttribute('disabled', '');
    });
  };

  var removeDisableAttributeForElements = function (elements) {
    Array.prototype.forEach.call(elements, function (element) {
      element.removeAttribute('disabled');
    });
  };

  setDisableAttributeForElements(formFieldsetElements);
  setDisableAttributeForElements(formSelectElements);

  var createFormSubmitHandler = function (callbackFormSubmit) {
    return function (evt) {
      callbackFormSubmit(new FormData(formElement));
      evt.preventDefault();
    };
  };

  var createFormResetHandler = function (callbackFormReset) {
    return function (evt) {
      callbackFormReset();
      evt.preventDefault();
    };
  };

  var onFormSubmit = function () {

  };
  var onFormReset = function () {

  };

  window.form = {
    activate: function (onFormSubmit, onFormReset) {
      onFormSubmit = createFormSubmitHandler(onFormSubmit);
      onFormReset = createFormResetHandler(onFormReset);

      formElement.classList.remove('ad-form--disabled');

      removeDisableAttributeForElements(formFieldsetElements);
      removeDisableAttributeForElements(formSelectElements);

      formElement.addEventListener('change', onFormChange);
      fieldTypeElement.addEventListener('change', onFieldTypeChange);
      fieldTimeInElement.addEventListener('change', onFieldTimeInChange);
      fieldTimeOutElement.addEventListener('change', onFieldTimeOutChange);
      fieldRoomNumberElement.addEventListener('change', onFieldRoomNumberChange);

      formElement.addEventListener('submit', onFormSubmit);
      formElement.addEventListener('reset', onFormReset);
    },
    deactivate: function () {
      setDisableAttributeForElements(formFieldsetElements);
      setDisableAttributeForElements(formSelectElements);

      formElement.classList.add('ad-form--disabled');

      fieldTypeElement.removeEventListener('change', onFieldTypeChange);
      fieldTimeInElement.removeEventListener('change', onFieldTimeInChange);
      fieldTimeOutElement.removeEventListener('change', onFieldTimeOutChange);
      fieldRoomNumberElement.removeEventListener('change', onFieldRoomNumberChange);

      formElement.reset();
      formElement.removeEventListener('change', onFormChange);
      formElement.removeEventListener('reset', onFormReset);
      formElement.removeEventListener('submit', onFormSubmit);
    },
    setAddressField: function (x, y) {
      fieldAddressElement.value = x + ', ' + y;
    }
  };
})();
