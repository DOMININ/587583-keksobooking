'use strict';

var CARD_AVATAR_PATH = 'img/avatars/user0{index}.png';

var TEXT_CAPACITY = '{rooms} комнаты для {guests} гостей';
var TEXT_TIME = 'Заезд после {checkin}, выезд до {checkout}';
var TEXT_PRICE = '?/ночь';
var TEXT_ERROR_CAPACITY = 'Измените значение поля';

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var PIN_MIN_X = 0;
var PIN_MAX_X = 1200;
var PIN_MIN_Y = 130;
var PIN_MAX_Y = 630;
var PIN_MAIN_WIDTH = 62;
var PIN_MAIN_HEIGHT = 84;
var PIN_MAIN_X = 570;
var PIN_MAIN_Y = 375;
var PIN_DEFAULT_LOCATION = PIN_MAIN_X + PIN_MAIN_WIDTH / 2 + ', ' + (PIN_MAIN_Y + PIN_MAIN_HEIGHT);

var GUESTS_MIN = 1;
var GUESTS_MAX = 20;
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;

var PICTURE_IMAGE_WIDTH = 45;
var PICTURE_IMAGE_HEIGHT = 40;

var OFFER_LIMIT = 8;

var OFFER_HOUSES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var OFFER_TEXT_TITLE = 'заголовок объявления';
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_TYPES_TRANSLATION = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
var OFFER_TIMES = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PICTURES = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

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

var KEYCODE_ESC = 27;

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getRandomItem = function (array) {
  return array[getRandomNumber(0, array.length - 1)];
};

var createAvatarUrl = function (index) {
  return CARD_AVATAR_PATH.replace('{index}', index + 1);
};

var createCapacityText = function (offer) {
  return TEXT_CAPACITY.replace('{rooms}', offer.rooms).replace('{guests}', offer.guests);
};

var createTimeText = function (offer) {
  return TEXT_TIME.replace('{checkin}', offer.checkin).replace('{checkout}', offer.checkout);
};

var getAndDeleteRandomItem = function (array) {
  var randomIndex = getRandomNumber(0, array.length - 1);
  var item = array[randomIndex];

  array.splice(randomIndex, 1);

  return item;
};

var createUniqueArray = function (originalArray) {
  var copiedArray = originalArray.slice();
  var len = getRandomNumber(1, originalArray.length);
  var result = [];
  var randomIndex;

  for (var i = 0; i < len; i++) {
    randomIndex = getRandomNumber(0, copiedArray.length - 1);
    result.push(copiedArray[randomIndex]);
    copiedArray.splice(randomIndex, 1);
  }

  return result;
};

var createOffer = function (index) {
  var x = getRandomNumber(PIN_MIN_X, PIN_MAX_X);
  var y = getRandomNumber(PIN_MIN_Y, PIN_MAX_Y);

  var checkInIndex = getRandomNumber(0, OFFER_TIMES.length - 1);
  var checkOutIndex = getRandomNumber(checkInIndex, OFFER_TIMES.length - 1);

  var houses = OFFER_HOUSES.slice();

  return {
    author: {
      avatar: createAvatarUrl(index)
    },
    offer: {
      title: getAndDeleteRandomItem(houses),
      address: x + ', ' + y,
      price: getRandomNumber(PRICE_MIN, PRICE_MAX),
      type: OFFER_TYPES_TRANSLATION[getRandomItem(OFFER_TYPES)],
      rooms: getRandomNumber(ROOMS_MIN, ROOMS_MAX),
      guests: getRandomNumber(GUESTS_MIN, GUESTS_MAX),
      checkin: OFFER_TIMES[checkInIndex],
      checkout: OFFER_TIMES[checkOutIndex],
      features: createUniqueArray(OFFER_FEATURES),
      description: '',
      photos: createUniqueArray(OFFER_PICTURES)
    },
    location: {
      x: x,
      y: y
    }
  };
};

var createOffers = function () {
  var offers = [];

  for (var i = 0; i < OFFER_LIMIT; i++) {
    offers.push(createOffer(i));
  }

  return offers;
};

var createPinElement = function (data) {
  var element = pinTemplateElement.cloneNode(true);

  element.style.left = data.location.x - PIN_WIDTH / 2 + 'px';
  element.style.top = data.location.y - PIN_HEIGHT + 'px';

  element.querySelector('img').src = data.author.avatar;
  element.querySelector('img').alt = OFFER_TEXT_TITLE;

  var handleClick = function () {
    removeCard();
    createCard(data);
  };

  element.addEventListener('click', handleClick);

  return element;
};

var createPinElements = function (offers) {
  var fragment = document.createDocumentFragment();

  offers.forEach(function (offer) {
    fragment.appendChild(createPinElement(offer));
  });

  return fragment;
};

var onCardCloseClick = function () {
  removeCard();
};

var createCard = function (data) {
  mapElement.insertBefore(createCardElement(data), mapFiltersElement);
  document.addEventListener('keydown', onDocumentEscKeydown);
};

var removeCard = function () {
  removeCardElement();
  document.removeEventListener('keydown', onDocumentEscKeydown);
};

var onDocumentEscKeydown = function (evt) {
  if (evt.keyCode === KEYCODE_ESC) {
    removeCardElement();
  }
};

var removeCardElement = function () {
  var cardCurrentElement = document.querySelector('.map__card');
  if (cardCurrentElement) {
    var cardCloseElement = cardElement.querySelector('.popup__close');
    if (cardCloseElement) {
      cardCloseElement.removeEventListener('click', onCardCloseClick);
    }
    cardCurrentElement.remove();
  }
};

var createCardFeaturesFragment = function (features) {
  var fragment = document.createDocumentFragment();

  features.forEach(function (feature) {
    var element = document.createElement('li');
    var textNode = document.createTextNode('\n');

    element.className = 'popup__feature popup__feature--' + feature;

    fragment.appendChild(element);
    fragment.appendChild(textNode);
  });

  return fragment;
};

var createCardPhotosFragment = function (photos) {
  var fragment = document.createDocumentFragment();

  photos.forEach(function (photo) {
    var element = document.createElement('img');
    var textNode = document.createTextNode('\n');

    element.src = photo;
    element.width = PICTURE_IMAGE_WIDTH;
    element.height = PICTURE_IMAGE_HEIGHT;
    element.className = 'popup__photo';

    fragment.appendChild(element);
    fragment.appendChild(textNode);
  });

  return fragment;
};

var createCardElement = function (data) {
  var offer = data.offer;
  var author = data.author;

  var cardElement = cardTemplateElement.cloneNode(true);
  var cardCloseElement = cardElement.querySelector('.popup__close');
  var cardFeaturesElement = cardElement.querySelector('.popup__features');
  var cardPhotosElement = cardElement.querySelector('.popup__photos');

  cardElement.querySelector('.popup__title').textContent = offer.title;
  cardElement.querySelector('.popup__text--address').textContent = offer.address;
  cardElement.querySelector('.popup__text--price').textContent = offer.price + TEXT_PRICE;
  cardElement.querySelector('.popup__type').textContent = offer.type;
  cardElement.querySelector('.popup__text--capacity').textContent = createCapacityText(offer);
  cardElement.querySelector('.popup__text--time').textContent = createTimeText(offer);
  cardElement.querySelector('.popup__description').textContent = offer.description;
  cardElement.querySelector('.popup__avatar').src = author.avatar;

  cardFeaturesElement.innerHTML = '';
  cardPhotosElement.innerHTML = '';

  cardFeaturesElement.appendChild(createCardFeaturesFragment(offer.features));
  cardPhotosElement.appendChild(createCardPhotosFragment(offer.photos));

  cardCloseElement.addEventListener('click', onCardCloseClick);

  return cardElement;
};

var addDisableAttribute = function (element) {
  element.setAttribute('disabled', '');
};

var removeDisableAttribute = function (element) {
  element.removeAttribute('disabled');
};

var onPinMainClick = function () {
  formElement.classList.remove('ad-form--disabled');
  formFieldsetElements.forEach(removeDisableAttribute);
  formSelectElements.forEach(removeDisableAttribute);

  mapElement.classList.remove('map--faded');

  pinsElement.appendChild(createPinElements(offers));

  pinMainElement.removeEventListener('click', onPinMainClick);
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

var onFormSubmitSuccess = function () {
  var mainElement = document.querySelector('main');
  var popupSuccessElement = document.querySelector('#success').content.querySelector('.success');
  mainElement.appendChild(popupSuccessElement);
};

var onPinMainMouseDown = function (mouseDownEvt) {
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

    var y = pinMainElement.offsetTop - shiftCoords.y;
    var x = pinMainElement.offsetLeft - shiftCoords.x;

    pinMainElement.style.top = Math.max(PIN_MIN_Y - PIN_MAIN_HEIGHT, Math.min(y, PIN_MAX_Y - PIN_MAIN_HEIGHT)) + 'px';
    pinMainElement.style.left = Math.max(PIN_MIN_X, Math.min(x, PIN_MAX_X - PIN_MAIN_WIDTH)) + 'px';
    fieldAddressElement.value = (parseInt(pinMainElement.style.left, 10) + PIN_MAIN_WIDTH / 2) + ', ' + (parseInt(pinMainElement.style.top, 10) + PIN_MAIN_HEIGHT);
  };

  var onDocumentMouseUp = function (mouseUpEvt) {
    mouseUpEvt.preventDefault();

    document.removeEventListener('mousemove', onDocumentMouseMove);
    document.removeEventListener('mouseup', onDocumentMouseUp);
  };

  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('mouseup', onDocumentMouseUp);
};

var formElement = document.querySelector('.ad-form');
var formFieldsetElements = document.querySelectorAll('fieldset');
var formSelectElements = document.querySelectorAll('select');

var fieldAddressElement = document.querySelector('#address');
var fieldTimeInElement = document.querySelector('#timein');
var fieldTimeOutElement = document.querySelector('#timeout');
var fieldTypeElement = document.querySelector('#type');
var fieldPriceElement = document.querySelector('#price');
var fieldRoomNumberElement = document.querySelector('#room_number');
var fieldCapacityElement = document.querySelector('#capacity');

fieldAddressElement.value = PIN_DEFAULT_LOCATION;

formFieldsetElements.forEach(addDisableAttribute);
formSelectElements.forEach(addDisableAttribute);

var mapElement = document.querySelector('.map');
var mapFiltersElement = document.querySelector('.map__filters-container');
var cardElement = document.querySelector('#card').cloneNode(true);
var cardTemplateElement = cardElement.content.querySelector('.map__card');
var pinsElement = document.querySelector('.map__pins');
var pinTemplateElement = document.querySelector('#pin').content.querySelector('button');
var pinMainElement = document.querySelector('.map__pin--main');

var offers = createOffers();

pinMainElement.addEventListener('click', onPinMainClick);
pinMainElement.addEventListener('mousedown', onPinMainMouseDown);

formElement.addEventListener('submit', onFormSubmitSuccess);
formElement.addEventListener('change', onFormChange);
fieldTypeElement.addEventListener('change', onFieldTypeChange);
fieldTimeInElement.addEventListener('change', onFieldTimeInChange);
fieldTimeOutElement.addEventListener('change', onFieldTimeOutChange);
fieldRoomNumberElement.addEventListener('change', onFieldRoomNumberChange);
