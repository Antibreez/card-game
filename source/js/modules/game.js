import {IMAGES_NAMES} from './constants.js';
import {getShuffledArr} from '../utils/random.js';
import Plyr from '../modules/plyr.js';
import Card from './card.js';

const $menu = document.getElementById(`menu`);
const $menuForm = document.getElementById(`menu-form`);
const $sizesRadio = $menuForm.querySelectorAll(`input[name='fieldSize']`);
const $cardBlock = document.getElementById(`card-block`);
const $playerWrap = document.querySelector(`.player-wrap`);

const player = new Plyr(`#player`);
player.on(`ended`, function () {
  player.fullscreen.exit();
});

const playerWrap = document.querySelector(`.player-wrap`);
const play = document.getElementById(`play`);
const exit = document.getElementById(`exit`);

// play.addEventListener('click', () => {
//   playerWrap.classList.remove(`js-hidden`);
//   player.fullscreen.enter();
//   player.play();
// });

class Game {
  constructor() {
    this.openedCards = 0;
    this.size = 4;
    this.isOddMove = true;
    this.firstCard = {};
    this.isDebounce = false;
    this.addEventListeners();
  }

  addCards() {
    $cardBlock.innerHTML = ``;
    const x = this.size;
    const shuffledArr = getShuffledArr(IMAGES_NAMES).slice(0, x * x / 2);
    const cardsArr = [];
    shuffledArr.forEach((name, idx) => {
      const card = new Card(name).getCard();
      card.setAttribute(`data-pairId`, idx);
      cardsArr.push(card);
      const copyCard = card.cloneNode(true);
      cardsArr.push(copyCard);
    });

    const fragment = document.createDocumentFragment();
    getShuffledArr(cardsArr).forEach((card, idx) => {
      card.setAttribute(`data-id`, idx);
      fragment.appendChild(card);
    });

    $cardBlock.appendChild(fragment);
    $cardBlock.classList.add(`size-${x}`);
  }

  onCardClick(e) {
    const card = e.currentTarget;

    if (card.classList.contains(`done`)) {
      return;
    }

    if (this.isDebounce === true) {
      return;
    }

    if (this.isOddMove) {
      this.firstCard = card;
      card.classList.add(`done`);
      this.isOddMove = false;
      this.makeDebounce(600);
    } else {
      card.classList.add(`done`);
      if (card.getAttribute(`data-pairid`) !== this.firstCard.getAttribute(`data-pairid`)) {
        this.hideBothCards(card);
        this.makeDebounce(1200);
      } else {
        this.makeDebounce(600);
        card.classList.add(`opened`);
        this.firstCard.classList.add(`opened`);
        this.openedCards += 2;
        if (this.openedCards === this.size * this.size) {
          this.onFinish();
        }
      }
      this.isOddMove = true;
    }
  }

  onFinish() {
    setTimeout(() => {
      playerWrap.classList.remove(`js-hidden`);
      player.fullscreen.enter();
      player.play();
    }, 800);
  }

  makeDebounce(time) {
    this.isDebounce = true;

    setTimeout(() => {
      this.isDebounce = false;
    }, time);
  }

  hideBothCards(currentCard) {
    return setTimeout(() => {
      currentCard.classList.remove(`done`);
      this.firstCard.classList.remove(`done`);
    }, 600);
  }

  getCardById(id) {
    return $cardBlock.querySelectorAll(`.card`)[id];
  }

  onSubmit(e) {
    e.preventDefault();
    $sizesRadio.forEach((sizeRadio) => {
      if (sizeRadio.checked) {
        this.size = +sizeRadio.value;
      }
    });

    this.addCards();
    this.addCardsEventListeners();
    $menu.classList.add(`hidden`);
  }

  addCardsEventListeners() {
    $cardBlock.querySelectorAll(`.card`).forEach((card) => {
      card.addEventListener(`click`, this.onCardClick.bind(this));
    });
  }

  addEventListeners() {
    $menuForm.addEventListener(`submit`, this.onSubmit.bind(this));
  }
}

export default Game;
