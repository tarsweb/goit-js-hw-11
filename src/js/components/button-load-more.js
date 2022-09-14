class ButtonLoadMore {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {
      button: document.querySelector(selector),
    };
    return refs;
  }

  enable() {
    this.refs.button.disabled = false;
  }

  disable() {
    this.refs.button.disabled = true;
  }

  show() {
    this.refs.button.classList.remove('visually-hidden');
  }

  hide() {
    this.refs.button.classList.add('visually-hidden');
  }
}

export default ButtonLoadMore;