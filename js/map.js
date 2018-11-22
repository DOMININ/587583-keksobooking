'use strict';

var AVATAR_PATH = 'img/avatars/';
var AVATAR_FORMAT = '.png';
var STICKER_MIN_X = 0;
var STICKER_MIN_Y = 130;
var STICKER_MAX_Y = 630;
var NUMBER_OF_OBJECTS = 8;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_TYPES = 0;
var MAX_TYPES = 3;
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MIN_GUESTS = 1;
var MAX_GUESTS = 20;
var MIN_CHECKIN = 0;
var MAX_CHECKIN = 2;
var MIN_CHECKOUT = 0;
var MAX_CHECKOUT = 2;
var MIN_FEATURES = 0;
var MAX_FEATURES = 5;
var RANDOM_PHOTO_FROM = 0;
var RANDOM_PHOTO_TO = 2;
var STICKER_WIDTH = 50;
var STICKER_HEIGHT = 70;
var TEXT_TITLE = 'заголовок объявления';

var adverts = [];
var houses = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var types = ['palace', 'flat', 'house', 'bungalo'];
var registrationTimes = ['12:00', '13:00', '14:00'];
var evictionTimes = ['12:00', '13:00', '14:00'];
var conditions = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var pictures = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var generatingRandomNumber = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

var compareRandom = function () {
  return Math.random() - 0.5;
};

pictures.sort(compareRandom);

var randomCoordinateX;
var randomCoordinateY;

var stickerBlockWidth = document.querySelector('.map__overlay').offsetWidth;

for (var i = 0; i < NUMBER_OF_OBJECTS; i++) {
  randomCoordinateX = generatingRandomNumber(STICKER_MIN_X, stickerBlockWidth);
  randomCoordinateY = generatingRandomNumber(STICKER_MIN_Y, STICKER_MAX_Y);

  adverts[i] = {
    author: {
      avatar: AVATAR_PATH + 'user0' + (i + 1) + AVATAR_FORMAT
    },

    offer: {
      title: houses[i],
      address: randomCoordinateX + ', ' + randomCoordinateY,
      price: generatingRandomNumber(MIN_PRICE, MAX_PRICE),
      type: types[generatingRandomNumber(MIN_TYPES, MAX_TYPES)],
      rooms: generatingRandomNumber(MIN_ROOMS, MAX_ROOMS),
      guests: generatingRandomNumber(MIN_GUESTS, MAX_GUESTS),
      checkin: registrationTimes[generatingRandomNumber(MIN_CHECKIN, MAX_CHECKIN)],
      checkout: evictionTimes[generatingRandomNumber(MIN_CHECKOUT, MAX_CHECKOUT)],
      features: conditions.slice(generatingRandomNumber(MIN_FEATURES, MAX_FEATURES)),
      description: '',
      photos: pictures[generatingRandomNumber(RANDOM_PHOTO_FROM, RANDOM_PHOTO_TO)]
    },

    location: {
      x: randomCoordinateX,
      y: randomCoordinateY
    }
  };
}

document.querySelector('.map').classList.remove('map--faded');

var templateStickerButton = document.querySelector('#pin').content.querySelector('button');

var pins = document.querySelector('.map__pins');

for (i = 0; i < adverts.length; i++) {
  var elementButton = templateStickerButton.cloneNode(true);
  elementButton.style.left = adverts[i].location.x - STICKER_WIDTH / 2 + 'px';
  elementButton.style.top = adverts[i].location.y - STICKER_HEIGHT + 'px';

  elementButton.querySelector('img').src = adverts[i].author.avatar;
  elementButton.querySelector('img').alt = TEXT_TITLE;

  pins.appendChild(elementButton);
}
