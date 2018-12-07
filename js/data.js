'use strict';

(function () {
  var CARD_AVATAR_PATH = 'img/avatars/user0{index}.png';

  var PIN_MIN_X = 0;
  var PIN_MAX_X = 1200;
  var PIN_MIN_Y = 130;
  var PIN_MAX_Y = 630;

  var GUESTS_MIN = 1;
  var GUESTS_MAX = 20;

  var PRICE_MIN = 1000;
  var PRICE_MAX = 1000000;

  var ROOMS_MIN = 1;
  var ROOMS_MAX = 5;

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
  var OFFER_LIMIT = 8;

  var getRandomNumber = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  var getRandomItem = function (array) {
    return array[getRandomNumber(0, array.length - 1)];
  };

  var createAvatarUrl = function (index) {
    return CARD_AVATAR_PATH.replace('{index}', index + 1);
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

  window.createOffers = function () {
    var offers = [];

    for (var i = 0; i < OFFER_LIMIT; i++) {
      offers.push(createOffer(i));
    }

    return offers;
  };
})();
