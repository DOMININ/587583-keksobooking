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

var generatingRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var createPinData = function (i) {
  var randomCoordinateX = generatingRandomNumber(STICKER_MIN_X, stickerBlockWidth);
  var randomCoordinateY = generatingRandomNumber(STICKER_MIN_Y, STICKER_MAX_Y);

  return {
    author: {
      avatar: AVATAR_PATH + 'user0' + (i + 1) + AVATAR_FORMAT
    },

    offer: {
      title: houses[i],
      address: randomCoordinateX + ', ' + randomCoordinateY,
      price: generatingRandomNumber(PRICE_MIN, PRICE_MAX),
      type: types[generatingRandomNumber(TYPES_MIN, TYPES_MAX)],
      rooms: generatingRandomNumber(ROOMS_MIN, ROOMS_MAX),
      guests: generatingRandomNumber(GUESTS_MIN, GUESTS_MAX),
      checkin: registrationTimes[generatingRandomNumber(CHECKIN_MIN, CHECKIN_MAX)],
      checkout: evictionTimes[generatingRandomNumber(CHECKOUT_MIN, CHECKOUT_MAX)],
      features: conditions.slice(generatingRandomNumber(FEATURES_MIN, FEATURES_MAX)),
      description: '',
      photos: pictures[generatingRandomNumber(RANDOM_PHOTO_FROM, RANDOM_PHOTO_TO)]
    },

    location: {
      x: randomCoordinateX,
      y: randomCoordinateY
    }
  };
};

var createPinElement = function (templateElement, data) {
  elementButton = templateElement.cloneNode(true);
  elementButton.style.left = data.location.x - STICKER_WIDTH / 2 + 'px';
  elementButton.style.top = data.location.y - STICKER_HEIGHT + 'px';

  elementButton.querySelector('img').src = data.author.avatar;
  elementButton.querySelector('img').alt = TEXT_TITLE;

  return elementButton;
};


var houses = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var types = ['palace', 'flat', 'house', 'bungalo'];
var registrationTimes = ['12:00', '13:00', '14:00'];
var evictionTimes = ['12:00', '13:00', '14:00'];
var conditions = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var pictures = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var mapOverlayElement = document.querySelector('.map__overlay');
var stickerBlockWidth = mapOverlayElement.offsetWidth;
var StickerButtonElement = document.querySelector('#pin').content.querySelector('button');
var stickerElements = document.querySelector('.map__pins');
var elementButton;

var pinData;
var pinFragment = document.createDocumentFragment();

for (var i = 0; i < PIN_LIMIT; i++) {
  pinData = createPinData(i);
  pinFragment.appendChild(createPinElement(StickerButtonElement, pinData));
  stickerElements.appendChild(pinFragment);
}

document.querySelector('.map').classList.remove('map--faded');
