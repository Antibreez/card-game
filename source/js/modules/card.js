const $cardTemplate = document.getElementById(`card`)
  .content
  .querySelector(`.card`);

class Card {
  constructor(name) {
    this.name = name;
  }

  getCard() {
    const node = $cardTemplate.cloneNode(true);
    node.querySelector(`.card__img`).src = `img/${this.name}`;
    return node;
  }
}

export default Card;
