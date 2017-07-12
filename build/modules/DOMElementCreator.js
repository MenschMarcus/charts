'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DOMElementCreator = function () {
  function DOMElementCreator() {
    _classCallCheck(this, DOMElementCreator);
  }

  _createClass(DOMElementCreator, [{
    key: 'create',
    value: function create() {
      var elemType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var classes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var attributes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

      // Error handling: element type must be given
      if (!elemType) return null;

      // Error handling: if only one class as string given, make it an array
      if (typeof classes == 'string') classes = [classes];

      // Error handling: if classes are null, make empty array
      if (!classes) classes = [];

      // Error handling: if attributes are null, make empty array
      if (!attributes) attributes = [];

      // Create element
      var elem = document.createElement(elemType);

      // Set id
      if (id != null) elem.id = id;

      // Set classes
      for (var idx = 0; idx < classes.length; idx++) {
        elem.classList.add(classes[idx]);
      } // Set attributes
      for (var _idx = 0; _idx < attributes.length; _idx++) {
        elem.setAttribute(attributes[_idx][0], attributes[_idx][1]);
      }return elem;
    }
  }]);

  return DOMElementCreator;
}();