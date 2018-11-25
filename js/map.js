'use strict';

var AVATAR_PATH = 'img/avatars/';
var AVATAR_FORMAT = '.png';
var USER = 'user0';
var NIGHT_PRICE = '₽/ночь';
var ROOMS = ' комнаты для ';
var GUESTS = ' гостей';
var CHECKIN_AFTER = 'Заезд после ';
var CHECKOUT_BEFORE = ', выезд до ';
var IMAGE = 'img';
var STICKER_MIN_X = 0;
var STICKER_MIN_Y = 130;
var STICKER_MAX_Y = 630;
var OFFER_LIMIT = 8;
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var GUESTS_MIN = 1;
var GUESTS_MAX = 20;
var CHECKIN_MIN = 0;
var CHECKIN_MAX = 2;
var CHECKOUT_MIN = 0;
var CHECKOUT_MAX = 2;
var FEATURES_MIN = 0;
var FEATURES_MAX = 5;
var RANDOM_PHOTO_FROM = 0;
var RANDOM_PHOTO_TO = 2;
var STICKER_WIDTH = 50;
var STICKER_HEIGHT = 70;


var TEXT_TITLE = 'заголовок объявления';
var HOUSES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var TYPES = ['palace', 'flat', 'house', 'bungalo'];

var TYPES_TRANSLATION = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
var REGISTRATION_TIMES = ['12:00', '13:00', '14:00'];
var EVICTION_TIMES = ['12:00', '13:00', '14:00'];
var CONDITIONS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PICTURES = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getRandomItem = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var createAvatarUrl = function (i) {
  return AVATAR_PATH + USER + (i + 1) + AVATAR_FORMAT;
};

var createPinCardData = function (i) {
  var randomCoordinateX = getRandomNumber(STICKER_MIN_X, overlayWidth);
  var randomCoordinateY = getRandomNumber(STICKER_MIN_Y, STICKER_MAX_Y);

  return {
    author: {
      avatar: createAvatarUrl(i)
    },

    offer: {
      title: pins[i],
      address: randomCoordinateX + ', ' + randomCoordinateY,
      price: getRandomNumber(PRICE_MIN, PRICE_MAX),
      type: TYPES_TRANSLATION[getRandomItem(TYPES)],
      rooms: getRandomNumber(ROOMS_MIN, ROOMS_MAX),
      guests: getRandomNumber(GUESTS_MIN, GUESTS_MAX),
      checkin: REGISTRATION_TIMES[getRandomNumber(CHECKIN_MIN, CHECKIN_MAX)],
      checkout: EVICTION_TIMES[getRandomNumber(CHECKOUT_MIN, CHECKOUT_MAX)],
      features: CONDITIONS.slice(getRandomNumber(FEATURES_MIN, FEATURES_MAX)),
      description: '',
      photos: PICTURES[getRandomNumber(RANDOM_PHOTO_FROM, RANDOM_PHOTO_TO)]
    },

    location: {
      x: randomCoordinateX,
      y: randomCoordinateY
    }
  };
};
var createPinElement = function (templateElement, data) {
  var elementButton = templateElement.cloneNode(true);

  elementButton.style.left = data.location.x - STICKER_WIDTH / 2 + 'px';
  elementButton.style.top = data.location.y - STICKER_HEIGHT + 'px';

  elementButton.querySelector(IMAGE).src = data.author.avatar;
  elementButton.querySelector(IMAGE).alt = TEXT_TITLE;

  return elementButton;
};

var createCardElement = function (templateElement, data) {
  var elementDescription = templateElement.cloneNode(true);
  var offer = data.offer;
  var author = data.author;

  var fragment = document.createDocumentFragment();

  elementDescription.querySelector('.popup__title').textContent = offer.title;
  elementDescription.querySelector('.popup__text--address').textContent = offer.address;
  elementDescription.querySelector('.popup__text--price').textContent = offer.price + NIGHT_PRICE;
  elementDescription.querySelector('.popup__type').textContent = offer.type;
  elementDescription.querySelector('.popup__text--capacity').textContent = offer.rooms + ROOMS + offer.guests + GUESTS;
  elementDescription.querySelector('.popup__text--time').textContent = CHECKIN_AFTER + offer.checkin + CHECKOUT_BEFORE + data.offer.checkout;
  elementDescription.querySelector('.popup__description').textContent = offer.description;
  elementDescription.querySelector('.popup__photo').src = offer.photos;
  elementDescription.querySelector('.popup__avatar').src = author.avatar;

  var newElement;
  for (var j = 0; j < offer.features.length; j++) {
    newElement = document.createElement('li');
    newElement.className = 'popup__feature popup__feature--' + offer.features[j];
    fragment.appendChild(newElement);
  }

  elementDescription.querySelector('.popup__features').appendChild(fragment);

  return elementDescription;
};

var pins = [];

for (i = 0; i < OFFER_LIMIT; i++) {
  pins.push(HOUSES[i % HOUSES.length]);
}

var mapElement = document.querySelector('.map');
var mapOverlayElement = document.querySelector('.map__overlay');
var mapFiltersElement = document.querySelector('.map__filters-container');
var cardElement = document.querySelector('#card');
var cardElementTemplate = cardElement.content.querySelector('.map__card');
var pinsElement = document.querySelector('.map__pins');
var pinButtonElement = document.querySelector('#pin').content.querySelector('button');

var overlayWidth = mapOverlayElement.offsetWidth;

var offers = [];

var pinFragment = document.createDocumentFragment();

for (var i = 0; i < OFFER_LIMIT; i++) {
  offers.push(createPinCardData(i));
  pinFragment.appendChild(createPinElement(pinButtonElement, offers[i]));
}

pinsElement.appendChild(pinFragment);

var card = createCardElement(cardElementTemplate, offers[0]);

mapElement.insertBefore(card, mapFiltersElement);

for (var j = 0; j <= FEATURES_MAX; j++) {
  var blocks = document.querySelectorAll('.popup__feature');
  document.querySelectorAll('.popup__features')[0].removeChild(blocks[0]);
}

document.querySelector('.map').classList.remove('map--faded');
