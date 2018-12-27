'use strict';

(function () {
  var TEXT_CAPACITY = '{rooms} комнаты для {guests} гостей';
  var TEXT_TIME = 'Заезд после {checkin}, выезд до {checkout}';
  var TEXT_PRICE = '?/ночь';

  var PICTURE_IMAGE_WIDTH = 45;
  var PICTURE_IMAGE_HEIGHT = 40;

  var KEYCODE_ESC = 27;

  var OfferTypesTranslation = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
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

  var onDocumentEscKeydown = function (evt) {
    if (evt.keyCode === KEYCODE_ESC) {
      removeCard();
    }
  };

  var removeCard = function () {
    removeCardElement();
    window.pins.resetActive();
    document.removeEventListener('keydown', onDocumentEscKeydown);
  };

  var onCardCloseClick = function () {
    removeCard();
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

  var createCapacityText = function (offer) {
    return TEXT_CAPACITY.replace('{rooms}', offer.rooms).replace('{guests}', offer.guests);
  };

  var createTimeText = function (offer) {
    return TEXT_TIME.replace('{checkin}', offer.checkin).replace('{checkout}', offer.checkout);
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
    cardElement.querySelector('.popup__type').textContent = OfferTypesTranslation[offer.type];
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

  var mapElement = document.querySelector('.map');
  var mapFiltersElement = document.querySelector('.map__filters-container');
  var cardElement = document.querySelector('#card').cloneNode(true);
  var cardTemplateElement = cardElement.content.querySelector('.map__card');

  window.card = {
    create: function (data) {
      mapElement.insertBefore(createCardElement(data), mapFiltersElement);
      document.addEventListener('keydown', onDocumentEscKeydown);
    },
    remove: function () {
      removeCard();
    }
  };
})();
