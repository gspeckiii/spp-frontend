// app/assets/scripts/modules/MobileMenu.js
export default class MobileMenu {
  constructor() {
    this.menuIcon = document.querySelector(".site-header__menu-icon")
    this.menuContent = document.querySelector(".site-header__menu-content")
    this.siteHeader = document.querySelector(".site-header")
    this.events()
  }

  events() {
    if (this.menuIcon) {
      this.menuIcon.addEventListener("click", () => this.toggleTheMenu())
    } else {
      console.warn("MobileMenu: .site-header__menu-icon not found in DOM")
    }
  }

  toggleTheMenu() {
    if (this.menuContent && this.siteHeader) {
      this.menuContent.classList.toggle("site-header__menu-content--is-visible")
      this.siteHeader.classList.toggle("site-header--is-expanded")
      this.menuIcon.classList.toggle("site-header__menu-icon--close-x")
    } else {
      console.warn("MobileMenu: Required elements not found for toggle")
    }
  }
}
