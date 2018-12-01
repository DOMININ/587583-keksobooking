'use strict';

var CARD_AVATAR_PATH = 'img/avatars/user0{index}.png';

var CAPACITY_TEXT = '{rooms} комнаты для {guests} гостей';
var TIME_TEXT = 'Заезд после {checkin}, выезд до {checkout}';

var NIGHT_PRICE = '₽/ночь';

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

var GUESTS_MIN = 1;
var GUESTS_MAX = 20;
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;

var OFFER_LIMIT = 8;

var PICTURE_IMAGE_WIDTH = 45;
var PICTURE_IMAGE_HEIGHT = 40;

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

var PIN_DEFAULT_LOCATION = PIN_MAIN_X + PIN_MAIN_WIDTH / 2 + ', ' + (PIN_MAIN_Y + PIN_MAIN_HEIGHT);

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
  return CAPACITY_TEXT.replace('{rooms}', offer.rooms).replace('{guests}', offer.guests);
};

var createTimeText = function (offer) {
  return TIME_TEXT.replace('{checkin}', offer.checkin).replace('{checkout}', offer.checkout);
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
  cardElement.querySelector('.popup__text--price').textContent = offer.price + NIGHT_PRICE;
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

var removeDisableAttribute = function (element) {
  element.removeAttribute('disabled');
};


var onPinMainClick = function () {
  formElement.classList.remove('ad-form--disabled');
  formFieldsetElements.forEach(removeDisableAttribute);
  formSelectElements.forEach(removeDisableAttribute);

  fieldAddressElement.value = PIN_DEFAULT_LOCATION;
  mapElement.classList.remove('map--faded');

  pinsElement.appendChild(createPinElements(offers));

  pinMainElement.removeEventListener('click', onPinMainClick);
};

var addDisableAttribute = function (element) {
  element.setAttribute('disabled', '');
};

var addInputSelect = function (selected, changeable) {
  for (var i = 0; i < OFFER_TIMES.length; i++) {
    if (selected[i].selected) {
      changeable.selectedIndex = i;
    }
  }
};

var formElement = document.querySelector('.ad-form');
var formFieldsetElements = document.querySelectorAll('fieldset');
var formSelectElements = document.querySelectorAll('select');
var fieldAddressElement = document.querySelector('#address');

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

formElement.onchange = function () {
  var inputTypeElement = document.querySelector('#type');
  var inputPriceElement = document.querySelector('#price');
  for (var key in OFFER_PRICES) {
    if (inputTypeElement.value === key) {
      inputPriceElement.setAttribute('min', OFFER_PRICES[key]);
      inputPriceElement.setAttribute('placeholder', OFFER_PRICES[key]);
    }
  }

  var inputTimeInElement = document.querySelector('#timein');
  var inputTimeOutElement = document.querySelector('#timeout');
  addInputSelect(inputTimeInElement, inputTimeOutElement);
  addInputSelect(inputTimeOutElement, inputTimeInElement); // не изменяется для этого поля

  var inputRoomNumberElement = document.querySelector('#room_number'); // рефакторинг этой части кода
  var inputCapacityElement = document.querySelector('#capacity');
  if (inputRoomNumberElement[0].selected) {
    var guestsCheck = inputCapacityElement.value === '0' || '2' || '3' ? 'Измените количество гостей' : '';
    inputCapacityElement.setCustomValidity(guestsCheck);

    inputCapacityElement.children[0].setAttribute('disabled', '');
    inputCapacityElement.children[1].setAttribute('disabled', '');
    inputCapacityElement.children[2].removeAttribute('disabled');
    inputCapacityElement.children[3].setAttribute('disabled', '');
  }

  if (inputRoomNumberElement[1].selected) {
    guestsCheck = inputCapacityElement.value === '0' || '3' ? 'Измените количество гостей' : '';
    inputCapacityElement.setCustomValidity(guestsCheck);

    inputCapacityElement.children[0].setAttribute('disabled', '');
    inputCapacityElement.children[1].removeAttribute('disabled');
    inputCapacityElement.children[2].removeAttribute('disabled');
    inputCapacityElement.children[3].setAttribute('disabled', '');
  }

  if (inputRoomNumberElement[2].selected) {
    guestsCheck = inputCapacityElement.value === '0' ? 'Измените количество гостей' : '';
    inputCapacityElement.setCustomValidity(guestsCheck);

    inputCapacityElement.children[0].removeAttribute('disabled');
    inputCapacityElement.children[1].removeAttribute('disabled');
    inputCapacityElement.children[2].removeAttribute('disabled');
    inputCapacityElement.children[3].setAttribute('disabled', '');
  }

  if (inputRoomNumberElement[3].selected) {
    guestsCheck = inputCapacityElement.value === '1' || '2' || '3' ? 'Измените количество гостей' : '';
    inputCapacityElement.setCustomValidity(guestsCheck);

    inputCapacityElement.children[0].setAttribute('disabled', '');
    inputCapacityElement.children[1].setAttribute('disabled', '');
    inputCapacityElement.children[2].setAttribute('disabled', '');
    inputCapacityElement.children[3].removeAttribute('disabled');
  }
};
