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

  var onFormSubmit;

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

  var addDisableAttribute = function (element) {
    element.setAttribute('disabled', '');
  };

  var removeDisableAttribute = function (element) {
    element.removeAttribute('disabled');
  };

  formFieldsetElements.forEach(addDisableAttribute);
  formSelectElements.forEach(addDisableAttribute);


  window.form = {
    activate: function (onRequestSuccess, onRequestError) {
      onFormSubmit = function (evt) {
        window.backend.upload(onRequestSuccess, onRequestError, new FormData(formElement));
        evt.preventDefault();
      };

      formElement.classList.remove('ad-form--disabled');

      formFieldsetElements.forEach(removeDisableAttribute);
      formSelectElements.forEach(removeDisableAttribute);

      formElement.addEventListener('change', onFormChange);
      fieldTypeElement.addEventListener('change', onFieldTypeChange);
      fieldTimeInElement.addEventListener('change', onFieldTimeInChange);
      fieldTimeOutElement.addEventListener('change', onFieldTimeOutChange);
      fieldRoomNumberElement.addEventListener('change', onFieldRoomNumberChange);

      formElement.addEventListener('submit', onFormSubmit);
    },
    deactivate: function () {
      formElement.classList.add('ad-form--disabled');

      formElement.reset();
      formElement.removeEventListener('change', onFormChange);
      formElement.removeEventListener('submit', onFormSubmit);

      fieldTypeElement.removeEventListener('change', onFieldTypeChange);
      fieldTimeInElement.removeEventListener('change', onFieldTimeInChange);
      fieldTimeOutElement.removeEventListener('change', onFieldTimeOutChange);
      fieldRoomNumberElement.removeEventListener('change', onFieldRoomNumberChange);
    },
    syncAddressField: function () {
      fieldAddressElement.value = window.pinMain.getPositionX() + ', ' + window.pinMain.getPositionY();
    }
  };
})();
