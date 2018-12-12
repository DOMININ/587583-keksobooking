'use strict';

(function () {
  var TEXT_ERROR_CAPACITY = 'Измените значение поля';

  var PIN_MAIN_WIDTH = 62;
  var PIN_MAIN_HEIGHT = 84;
  var PIN_MAIN_X = 570;
  var PIN_MAIN_Y = 375;
  var PIN_DEFAULT_LOCATION = PIN_MAIN_X + PIN_MAIN_WIDTH / 2 + ', ' + (PIN_MAIN_Y + PIN_MAIN_HEIGHT);

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

  var formElement = document.querySelector('.ad-form');

  var fieldTimeInElement = document.querySelector('#timein');
  var fieldTimeOutElement = document.querySelector('#timeout');
  var fieldTypeElement = document.querySelector('#type');
  var fieldPriceElement = document.querySelector('#price');
  var fieldRoomNumberElement = document.querySelector('#room_number');
  var fieldCapacityElement = document.querySelector('#capacity');
  var formFieldsetElements = document.querySelectorAll('fieldset');
  var formSelectElements = document.querySelectorAll('select');
  var fieldAddressElement = document.querySelector('#address');

  var addDisableAttribute = function (element) {
    element.setAttribute('disabled', '');
  };

  var removeDisableAttribute = function (element) {
    element.removeAttribute('disabled');
  };

  formFieldsetElements.forEach(addDisableAttribute);
  formSelectElements.forEach(addDisableAttribute);

  var onFormError = function () {
    window.messages.createErrorMessage();
  };

  var onFormSuccess = function () {
    var mapElement = document.querySelector('.map');

    window.messages.createSuccessMessage();
    window.pinMain.resetPosition();
    window.form.deactivate();

    mapElement.classList.add('map--faded');
  };

  window.form = {
    activate: function () {
      var onSubmit = function () {
        var formData = new FormData(formElement);

        window.backend.upload(onFormSuccess, onFormError, formData);
      };

      formElement.classList.remove('ad-form--disabled');

      formFieldsetElements.forEach(removeDisableAttribute);
      formSelectElements.forEach(removeDisableAttribute);

      formElement.addEventListener('change', onFormChange);
      fieldTypeElement.addEventListener('change', onFieldTypeChange);
      fieldTimeInElement.addEventListener('change', onFieldTimeInChange);
      fieldTimeOutElement.addEventListener('change', onFieldTimeOutChange);
      fieldRoomNumberElement.addEventListener('change', onFieldRoomNumberChange);

      formElement.addEventListener('submit', function (evt) {
        onSubmit();
        evt.preventDefault();
      });
    },
    deactivate: function () {
      formElement.classList.add('ad-form--disabled');

      formElement.reset();

      fieldAddressElement.value = PIN_DEFAULT_LOCATION;

      formElement.removeEventListener('change', onFormChange);
      fieldTypeElement.removeEventListener('change', onFieldTypeChange);
      fieldTimeInElement.removeEventListener('change', onFieldTimeInChange);
      fieldTimeOutElement.removeEventListener('change', onFieldTimeOutChange);
      fieldRoomNumberElement.removeEventListener('change', onFieldRoomNumberChange);
    },
    setAddressFieldValue: function () {
      var pinMainElement = document.querySelector('.map__pin--main');

      fieldAddressElement.value = (parseInt(pinMainElement.style.left, 10) + PIN_MAIN_WIDTH / 2) + ', ' + (parseInt(pinMainElement.style.top, 10) + PIN_MAIN_HEIGHT);
    }
  };
})();
