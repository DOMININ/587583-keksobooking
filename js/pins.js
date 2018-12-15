'use strict';

(function () {
  var TEXT_OFFER_TITLE = 'заголовок объявления';

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var pinTemplateElement = document.querySelector('#pin').content.querySelector('button');

  var createPinElement = function (data) {
    var element = pinTemplateElement.cloneNode(true);

    element.style.left = data.location.x - PIN_WIDTH / 2 + 'px';
    element.style.top = data.location.y - PIN_HEIGHT + 'px';

    element.querySelector('img').src = data.author.avatar;
    element.querySelector('img').alt = TEXT_OFFER_TITLE;

    var handleClick = function () {
      window.cards.remove();
      window.cards.create(data);
    };

    element.addEventListener('click', handleClick);

    return element;
  };

  window.pins = {
    create: function (offers) {
      var fragment = document.createDocumentFragment();

      offers.forEach(function (offer) {
        fragment.appendChild(createPinElement(offer));
      });

      return fragment;
    },
    remove: function () {
      var pinElement = document.querySelectorAll('.map__pin');
      for (var i = 1; pinElement.length - 1; i++) {
        pinElement[i].remove();
      }
    }
  };
})();
