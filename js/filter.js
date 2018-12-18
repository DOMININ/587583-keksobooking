'use strict';

(function () {
  var houseTypeElement = document.querySelector('#housing-type');
  var formFilterElement = document.querySelector('.map__filters');

  var onFilterTypeChange = function (evt) {
    var typeValue = evt.target.value;
  };

  houseTypeElement.addEventListener('change', onFilterTypeChange);

  window.filter = {
    activate: function (offers) {
      var houseType;
      Array.prototype.forEach.call(offers, function () {
        houseType = offers.filter(function (offer) {
          return offer.offer.type === houseTypeElement.value;
        });
      });
      return houseType.length === 0 ? offers : houseType;
    },
    deactivate: function () {
      formFilterElement.reset();
    }
  };
})();
