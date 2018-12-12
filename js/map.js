'use strict';

var TEXT_CAPACITY = '{rooms} комнаты для {guests} гостей';
var TEXT_TIME = 'Заезд после {checkin}, выезд до {checkout}';
var TEXT_PRICE = '?/ночь';

var PICTURE_IMAGE_WIDTH = 45;
var PICTURE_IMAGE_HEIGHT = 40;

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var OFFER_TEXT_TITLE = 'заголовок объявления';

var KEYCODE_ESC = 27;

var createCapacityText = function (offer) {
  return TEXT_CAPACITY.replace('{rooms}', offer.rooms).replace('{guests}', offer.guests);
};

var createTimeText = function (offer) {
  return TEXT_TIME.replace('{checkin}', offer.checkin).replace('{checkout}', offer.checkout);
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

var onPinMainClick = function () {
  mapElement.classList.remove('map--faded');

  pinsElement.appendChild(createPinElements(offers));
  pinMainElement.removeEventListener('click', onPinMainClick);

  window.form.activate();
};

var mapElement = document.querySelector('.map');
var mapFiltersElement = document.querySelector('.map__filters-container');
var cardElement = document.querySelector('#card').cloneNode(true);
var cardTemplateElement = cardElement.content.querySelector('.map__card');
var pinsElement = document.querySelector('.map__pins');
var pinTemplateElement = document.querySelector('#pin').content.querySelector('button');
var pinMainElement = document.querySelector('.map__pin--main');

var offers;

window.form.setAddressFieldValue();

window.backend.load(function (loadedOffers) {
  offers = loadedOffers;

  pinMainElement.addEventListener('click', onPinMainClick);
  pinMainElement.addEventListener('mousedown', window.pinMain.onPinMainMouseDown());
});
