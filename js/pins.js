'use strict';

(function () {
  var TEXT_OFFER_TITLE = 'заголовок объявления';

  var pinsElement = document.querySelector('.map__pins');
  var pinTemplateElement = document.querySelector('#pin').content.querySelector('button');

  var createPinElement = function (data) {
    var element = pinTemplateElement.cloneNode(true);

    element.style.left = data.location.x + 'px';
    element.style.top = data.location.y + 'px';

    element.querySelector('img').src = data.author.avatar;
    element.querySelector('img').alt = TEXT_OFFER_TITLE;

    return element;
  };

  window.pins = {
    create: function (offers, onPinClick) {
      var fragment = document.createDocumentFragment();

      offers.forEach(function (offer) {
        var element = createPinElement(offer);

        element.addEventListener('click', function () {
          onPinClick(offer);
          element.classList.add('map__pin--active');
        });

        fragment.appendChild(element);
      });

      return pinsElement.appendChild(fragment);
    },
    remove: function () {
      var pinElements = document.querySelectorAll('.map__pin:not(.map__pin--main)');

      Array.prototype.forEach.call(pinElements, function (pinElement) {
        pinElement.remove();
      });
    },
    resetActive: function () {
      var pinCurrentElement = document.querySelector('.map__pin--active');
      if (pinCurrentElement) {
        pinCurrentElement.classList.remove('map__pin--active');
      }
    }
  };
})();
