'use strict';

var AVATAR_PATH = 'img/avatars/';
var AVATAR_FORMAT = '.png';
var STICKER_MIN_X = 0;
var STICKER_MIN_Y = 130;
var STICKER_MAX_Y = 630;
var PIN_LIMIT = 8;
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var TYPES_MIN = 0;
var TYPES_MAX = 3;
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
var REGISTRATION_TIMES = ['12:00', '13:00', '14:00'];
var EVICTION_TIMES = ['12:00', '13:00', '14:00'];
var CONDITIONS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PICTURES = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var generatingRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var createPinCardData = function (i) {
  var randomCoordinateX = generatingRandomNumber(STICKER_MIN_X, stickerBlockWidth);
  var randomCoordinateY = generatingRandomNumber(STICKER_MIN_Y, STICKER_MAX_Y);

  return {
    author: {
      avatar: AVATAR_PATH + 'user0' + (i + 1) + AVATAR_FORMAT
    },

    offer: {
      title: HOUSES[i],
      address: randomCoordinateX + ', ' + randomCoordinateY,
      price: generatingRandomNumber(PRICE_MIN, PRICE_MAX),
      type: TYPES[generatingRandomNumber(TYPES_MIN, TYPES_MAX)],
      rooms: generatingRandomNumber(ROOMS_MIN, ROOMS_MAX),
      guests: generatingRandomNumber(GUESTS_MIN, GUESTS_MAX),
      checkin: REGISTRATION_TIMES[generatingRandomNumber(CHECKIN_MIN, CHECKIN_MAX)],
      checkout: EVICTION_TIMES[generatingRandomNumber(CHECKOUT_MIN, CHECKOUT_MAX)],
      features: CONDITIONS.slice(generatingRandomNumber(FEATURES_MIN, FEATURES_MAX)),
      description: '',
      photos: PICTURES[generatingRandomNumber(RANDOM_PHOTO_FROM, RANDOM_PHOTO_TO)]
    },

    location: {
      x: randomCoordinateX,
      y: randomCoordinateY
    }
  };
};

var createPinElement = function (templateElement, data) {
  var elementButton;
  elementButton = templateElement.cloneNode(true);
  elementButton.style.left = data.location.x - STICKER_WIDTH / 2 + 'px';
  elementButton.style.top = data.location.y - STICKER_HEIGHT + 'px';

  elementButton.querySelector('img').src = data.author.avatar;
  elementButton.querySelector('img').alt = TEXT_TITLE;

  return elementButton;
};

var createDataElement = function (templateElement, data) {
  var elementDescription;
  elementDescription = templateElement.cloneNode(true);

  elementDescription.querySelector('.popup__title').textContent = data.offer.title;
  elementDescription.querySelector('.popup__text--address').textContent = data.offer.address;
  elementDescription.querySelector('.popup__text--price').textContent = data.offer.price + '₽/ночь';
  elementDescription.querySelector('.popup__type').textContent = '!!!ЗАМЕНИТЬ';
  elementDescription.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
  elementDescription.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
  elementDescription.querySelector('.popup__features').textContent = data.offer.features;
  elementDescription.querySelector('.popup__description').textContent = data.offer.description;
  elementDescription.querySelector('.popup__photo').src = data.offer.photos;
  elementDescription.querySelector('.popup__avatar').src = data.author.avatar;

  return elementDescription;
};

var mapOverlayElement = document.querySelector('.map__overlay');
var stickerBlockWidth = mapOverlayElement.offsetWidth;
var stickerButtonElement = document.querySelector('#pin').content.querySelector('button');
var stickerElements = document.querySelector('.map__pins');

var dataElement = document.querySelector('#card').content.querySelector('.map__card');
var beforeElement = document.querySelector('.map__filters-container');

var pinData;
var pinFragment = document.createDocumentFragment();
var dataFragment = document.createDocumentFragment();

var map = document.querySelector('.map');

for (var i = 0; i < PIN_LIMIT; i++) {
  pinData = createPinCardData(i);
  pinFragment.appendChild(createPinElement(stickerButtonElement, pinData));
  stickerElements.appendChild(pinFragment);

  dataFragment.appendChild(createDataElement(dataElement, pinData));
}

map.insertBefore(dataFragment, beforeElement);

document.querySelector('.map').classList.remove('map--faded');
