import {IMAGES_NAMES} from './constants.js';
import {CARTOONS_ID} from './constants.js';
import {getShuffledArr} from '../utils/random.js';
import Plyr from '../modules/plyr.js';
import Card from './card.js';

const $menu = document.getElementById(`menu`);
const $menuForm = document.getElementById(`menu-form`);
const $sizesRadio = $menuForm.querySelectorAll(`input[name='fieldSize']`);
const $cardBlock = document.getElementById(`card-block`);
const $playerWrap = document.querySelector(`.player-wrap`);
const $playerContainer = document.querySelector(`.player-container`);
const $newGameBtn = document.querySelector(`.player-new-game`);
//const $playerIframe = $playerWrap.querySelector(`iframe`);



// const player = new Plyr(`#player`, {
//   clickToPlay: true,
// });
// player.on(`ended`, function () {
//   if (player.fullscreen.active) {
//     player.fullscreen.exit();
//   }
// });

// const playerWrap = document.querySelector(`.player-wrap`);
// const play = document.getElementById(`play`);
// const exit = document.getElementById(`exit`);

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
    this.player = {};
    this.cartoonIds = [];
  }

  getCartoonId() {
    let cartoonId = ``;
    while (true) {
      cartoonId = CARTOONS_ID[Math.floor(Math.random() * CARTOONS_ID.length)];
      if (this.cartoonIds.indexOf(cartoonId) === -1) {
        break;
      } else if (this.cartoonIds.length === CARTOONS_ID.length) {
        this.cartoonIds = [];
        break;
      }
    }

    this.cartoonIds.push(cartoonId);
    return cartoonId;
  }

  addPlayer() {
    const fragment = document.createDocumentFragment();
    const player = document.createElement(`div`);
    player.classList.add(`plyr__video-embed`);
    player.setAttribute(`id`, `player`);
    const iframe = document.createElement(`iframe`);
    iframe.setAttribute(
      `src`,
      `https://www.youtube.com/embed/`
      + this.getCartoonId()
      + `?origin=window.location.host;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`
    );
    iframe.setAttribute(`allowfullscreen`, ``);
    iframe.setAttribute(`allowtransparency`, ``);
    iframe.setAttribute(`allow`, `autoplay`);
    player.appendChild(iframe);
    fragment.appendChild(player);
    $playerContainer.appendChild(player);


    // $playerIframe.setAttribute(
    //   `src`,
    //   `https://www.youtube.com/embed/`
    //   + this.getCartoonId()
    //   + `?origin=window.location.host;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`
    // )

    this.player = new Plyr(`#player`, {
      clickToPlay: true,
    });

    this.player.on(`ended`, () => {
      if (this.player.fullscreen.active) {
        this.player.fullscreen.exit();
      }
    });
  }

  removePlayer() {
    this.player.destroy();
    $playerContainer.innerHTML = ``;
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

  removeCards() {
    $cardBlock.querySelectorAll(`.card`).forEach((card) => {
      card.remove();
    });
  }

  onNewGameClick() {
    this.removeCardsEventListeners();
    this.removeCards();
    $playerWrap.classList.add(`js-hidden`);
    $menu.classList.remove(`js-hidden`);
    this.removePlayer();
    this.openedCards = 0;
    this.size = 4;
    this.isOddMove = true;
    this.firstCard = {};
    this.isDebounce = false;
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
      $playerWrap.classList.remove(`js-hidden`);
      this.player.fullscreen.enter();
      this.player.play();
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
    $menu.classList.add(`js-hidden`);
    this.addPlayer();
  }

  addCardsEventListeners() {
    $cardBlock.querySelectorAll(`.card`).forEach((card) => {
      card.addEventListener(`click`, this.onCardClick.bind(this));
    });
  }

  removeCardsEventListeners() {
    $cardBlock.querySelectorAll(`.card`).forEach((card) => {
      card.removeEventListener(`click`, this.onCardClick.bind(this));
    });
  }

  addEventListeners() {
    $menuForm.addEventListener(`submit`, this.onSubmit.bind(this));
    $newGameBtn.addEventListener(`click`, this.onNewGameClick.bind(this));
  }
}

export default Game;
