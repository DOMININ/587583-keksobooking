'use strict';

var AVATAR_PATH = 'img/avatars/';
var AVATAR_FORMAT = '.png';

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

for (var i = 0; i < 8; i++) {
  randomCoordinateX = generatingRandomNumber(130, 630);
  randomCoordinateY = generatingRandomNumber(130, 630);

  adverts[i] = {
    author: {
      avatar: AVATAR_PATH + 'user0' + (i + 1) + AVATAR_FORMAT
    },

    offer: {
      title: houses[i],
      address: randomCoordinateX + ', ' + randomCoordinateY,
      price: generatingRandomNumber(1000, 1000000),
      type: types[generatingRandomNumber(0, 3)],
      rooms: generatingRandomNumber(1, 5),
      guests: generatingRandomNumber(1, 20),
      checkin: registrationTimes[generatingRandomNumber(0, 2)],
      checkout: evictionTimes[generatingRandomNumber(0, 2)],
      features: conditions.slice(generatingRandomNumber(0, 5)),
      description: '',
      photos: pictures[generatingRandomNumber(0, 2)]
    },

    location: {
      x: randomCoordinateX,
      y: randomCoordinateY
    }
  };
}

document.querySelector('.map').classList.remove('map--faded');

/*  document.querySelector('.map__pin').style.left = randomCoordinateX + 'px';
document.querySelector('.map__pin').style.top = randomCoordinateY + 'px';
document.querySelector('.map__pin img').src = avatar;  */
