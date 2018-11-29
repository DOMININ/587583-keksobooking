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
      photos: OFFER_PICTURES[getRandomNumber(0, OFFER_PICTURES.length - 1)]
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

var createPinElement = function (templateElement, data) {
  var element = templateElement.cloneNode(true);

  element.style.left = data.location.x - PIN_WIDTH / 2 + 'px';
  element.style.top = data.location.y - PIN_HEIGHT + 'px';

  element.querySelector('img').src = data.author.avatar;
  element.querySelector('img').alt = OFFER_TEXT_TITLE;

  element.addEventListener('click', function () {
    var cardCurrentElement = document.querySelector('.map__card');
    if (cardCurrentElement) {
      cardCurrentElement.remove();
    }
    var cardElement = createCardElement(cardTemplateElement, data);

    mapElement.insertBefore(cardElement, mapFiltersElement);
  });
  return element;
};

var createPinElements = function (templateElement, offers) {
  var fragment = document.createDocumentFragment();

  offers.forEach(function (offer) {
    fragment.appendChild(
        createPinElement(templateElement, offer)
    );
  });

  return fragment;
};

var createCardElement = function (templateElement, data) {
  var cardElement = templateElement.cloneNode(true);
  var fragment = document.createDocumentFragment();
  var offer = data.offer;
  var author = data.author;

  var cardCloseElement = cardElement.querySelector('.popup__close');

  var featuresElement = cardElement.querySelector('.popup__features');

  cardElement.querySelector('.popup__title').textContent = offer.title;
  cardElement.querySelector('.popup__text--address').textContent = offer.address;
  cardElement.querySelector('.popup__text--price').textContent = offer.price + NIGHT_PRICE;
  cardElement.querySelector('.popup__type').textContent = offer.type;
  cardElement.querySelector('.popup__text--capacity').textContent = createCapacityText(offer);
  cardElement.querySelector('.popup__text--time').textContent = createTimeText(offer);
  cardElement.querySelector('.popup__description').textContent = offer.description;
  cardElement.querySelector('.popup__photo').src = offer.photos;
  cardElement.querySelector('.popup__avatar').src = author.avatar;

  featuresElement.innerHTML = '';

  offer.features.forEach(function (feature) {
    var newElement = document.createElement('li');

    newElement.className = 'popup__feature popup__feature--' + feature;
    var lineBreak = document.createTextNode('\n');

    fragment.appendChild(newElement);
    fragment.appendChild(lineBreak);
  });

  featuresElement.appendChild(fragment);

  cardCloseElement.addEventListener('click', function () {
    var cardCurrentElement = document.querySelector('.map__card');
    cardCurrentElement.remove();
  });

  document.addEventListener('keydown', function (evt) {
    var cardCurrentElement = document.querySelector('.map__card');
    if (evt.keyCode === KEYCODE_ESC && cardCurrentElement) {
      cardCurrentElement.remove();
    }
  });

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

  pinsElement.appendChild(
      createPinElements(pinTemplateElement, offers)
  );

  pinMainElement.removeEventListener('click', onPinMainClick);
};

var formElement = document.querySelector('.ad-form');
var formFieldsetElements = document.querySelectorAll('fieldset');
var formSelectElements = document.querySelectorAll('select');
var fieldAddressElement = document.querySelector('#address');

var addDisableAttribute = function (element) {
  element.setAttribute('disabled', '');
};

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
