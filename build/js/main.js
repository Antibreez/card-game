(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _game = _interopRequireDefault(require("./modules/game.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var game = new _game.default();

},{"./modules/game.js":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var $cardTemplate = document.getElementById("card").content.querySelector(".card");

var Card = /*#__PURE__*/function () {
  function Card(name) {
    _classCallCheck(this, Card);

    this.name = name;
  }

  _createClass(Card, [{
    key: "getCard",
    value: function getCard() {
      var node = $cardTemplate.cloneNode(true);
      node.querySelector(".card__img").src = "img/".concat(this.name);
      return node;
    }
  }]);

  return Card;
}();

var _default = Card;
exports.default = _default;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IMAGES_NAMES = void 0;
var IMAGES_NAMES = ["apple.svg", "ball.svg", "banana.svg", "cake.svg", "car.svg", "cat.svg", "cloud.svg", "dog.svg", "duck.svg", "earth.svg", "ferris.svg", "frig.svg", "flag.svg", "frog.svg", "hat.svg", "hot-dog.svg", "house.svg", "leaf.svg", "lightning.svg", "moon.svg", "mustache.svg", "rainbow.svg", "road.svg", "rocket.svg", "ship.svg", "smile.svg", "star.svg", "sun.svg", "tree.svg", "t-shirt.svg", "tv-screen.svg", "umbrella.svg"];
exports.IMAGES_NAMES = IMAGES_NAMES;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants.js");

var _random = require("../utils/random.js");

var _card = _interopRequireDefault(require("./card.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var $menu = document.getElementById("menu");
var $menuForm = document.getElementById("menu-form");
var $sizesRadio = $menuForm.querySelectorAll("input[name='fieldSize']");
var $cardBlock = document.getElementById("card-block");

var Game = /*#__PURE__*/function () {
  function Game() {
    _classCallCheck(this, Game);

    this.size = 4;
    this.isOddMove = true;
    this.firstCard = {};
    this.isDebounce = false;
    this.addEventListeners();
  }

  _createClass(Game, [{
    key: "addCards",
    value: function addCards() {
      $cardBlock.innerHTML = "";
      var x = this.size;
      var shuffledArr = (0, _random.getShuffledArr)(_constants.IMAGES_NAMES).slice(0, x * x / 2);
      var cardsArr = [];
      shuffledArr.forEach(function (name, idx) {
        var card = new _card.default(name).getCard();
        card.setAttribute("data-pairId", idx);
        cardsArr.push(card);
        var copyCard = card.cloneNode(true);
        cardsArr.push(copyCard);
      });
      var fragment = document.createDocumentFragment();
      (0, _random.getShuffledArr)(cardsArr).forEach(function (card, idx) {
        card.setAttribute("data-id", idx);
        fragment.appendChild(card);
      });
      $cardBlock.appendChild(fragment);
      $cardBlock.classList.add("size-".concat(x));
    }
  }, {
    key: "onCardClick",
    value: function onCardClick(e) {
      var card = e.currentTarget;

      if (card.classList.contains("done")) {
        return;
      }

      if (this.isDebounce === true) {
        return;
      }

      if (this.isOddMove) {
        this.firstCard = card;
        card.classList.add("done");
        this.isOddMove = false;
        this.makeDebounce(600);
      } else {
        card.classList.add("done");

        if (card.getAttribute("data-pairid") !== this.firstCard.getAttribute("data-pairid")) {
          this.hideBothCards(card);
          this.makeDebounce(1200);
        } else {
          this.makeDebounce(600);
          card.classList.add("opened");
          this.firstCard.classList.add("opened");
        }

        this.isOddMove = true;
      }
    }
  }, {
    key: "makeDebounce",
    value: function makeDebounce(time) {
      var _this = this;

      this.isDebounce = true;
      setTimeout(function () {
        _this.isDebounce = false;
      }, time);
    }
  }, {
    key: "hideBothCards",
    value: function hideBothCards(currentCard) {
      var _this2 = this;

      return setTimeout(function () {
        currentCard.classList.remove("done");

        _this2.firstCard.classList.remove("done");
      }, 600);
    }
  }, {
    key: "getCardById",
    value: function getCardById(id) {
      return $cardBlock.querySelectorAll(".card")[id];
    }
  }, {
    key: "onSubmit",
    value: function onSubmit(e) {
      var _this3 = this;

      e.preventDefault();
      $sizesRadio.forEach(function (sizeRadio) {
        if (sizeRadio.checked) {
          _this3.size = +sizeRadio.value;
        }
      });
      this.addCards();
      this.addCardsEventListeners();
      $menu.classList.add("hidden");
    }
  }, {
    key: "addCardsEventListeners",
    value: function addCardsEventListeners() {
      var _this4 = this;

      $cardBlock.querySelectorAll(".card").forEach(function (card) {
        card.addEventListener("click", _this4.onCardClick.bind(_this4));
      });
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      $menuForm.addEventListener("submit", this.onSubmit.bind(this));
    }
  }]);

  return Game;
}();

var _default = Game;
exports.default = _default;

},{"../utils/random.js":5,"./card.js":2,"./constants.js":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getShuffledArr = void 0;

var getShuffledArr = function getShuffledArr(arr) {
  return arr.sort(function () {
    return Math.random() - 0.5;
  });
};

exports.getShuffledArr = getShuffledArr;

},{}]},{},[1])

//# sourceMappingURL=main.js.map
