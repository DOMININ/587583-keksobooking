'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var mapIsActive = false;

  window.map = {
    isActivated: function () {
      return mapIsActive;
    },
    activate: function () {
      mapIsActive = true;
      mapElement.classList.remove('map--faded');
    },
    deactivate: function () {
      mapIsActive = false;
      mapElement.classList.add('map--faded');
    }
  };
})();
