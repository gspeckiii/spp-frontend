class Modal {
  constructor() {
    this.injectHTML()
    this.modal = document.querySelector(".modal")
    this.closeIcon = document.querySelector(".modal__close")
    this.events()
  }

  events() {
    // listen for close click
    this.closeIcon.addEventListener("click", () => this.closeTheModal())

    // pushes any key
    document.addEventListener("keyup", e => this.keyPressHandler(e))
  }

  keyPressHandler(e) {
    if (e.keyCode == 27) {
      this.closeTheModal()
    }
  }

  openTheModal() {
    this.modal.classList.add("modal--is-visible")
  }

  closeTheModal() {
    this.modal.classList.remove("modal--is-visible")
  }

  injectHTML() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
    <div class="modal">
    <div class="modal__inner">
      <h2 class="section-title section-title--green section-title--less-margin"><img src="assets/images/icons/mail.svg" class="section-title__icon"> Get in <strong>Touch</strong></h2>
      <div class="wrapper wrapper--narrow">
        <p class="modal__description">Click the HipCamp link below to book a campsite or connect with me on social network to discuss other opportunities.</p>
        
      </div>

      <div class="social-icons">
        <a href="https://www.facebook.com/george.s.peck.1" target="_blank" class="social-icons__icon"><img src="assets/images/icons/facebook.svg" alt="Facebook"></a>
        <a href="https://twitter.com/grittyNwitty" target="_blank" class="social-icons__icon"><img src="assets/images/icons/twitter.svg" alt="Twitter"></a>
        <a href="https://www.instagram.com/georgeshermanpeck/" target="_blank" class="social-icons__icon"><img src="assets/images/icons/instagram.svg" alt="Instagram"></a>
        <a href="https://www.youtube.com/channel/UCwUTc0JHLL97aoXBTU5P3kw" target="_blank" class="social-icons__icon"><img src="assets/images/icons/youtube.svg" alt="YouTube"></a>
      </div>

      <div class="wrapper wrapper--narrow hipcamp">
      <a href="https://www.hipcamp.com/en-US/u/georgepa798bb"><img src="assets/images/icons/hipcamp.svg" alt="HipCamp"></a>
      </div>
    </div>
    <div class="modal__close">X</div>
  </div>
    `
    )
  }
}

export default Modal
