import throttle from "lodash/throttle"
import debounce from "lodash/debounce"

class RevealOnScroll {
  constructor(els, thresholdPercent = 75) {
    this.thresholdPercent = thresholdPercent
    this.itemsToReveal = els
    this.browserHeight = window.innerHeight
    this.hideInitially()
    this.scrollThrottle = throttle(this.calcCaller, 200).bind(this)
    this.events()
  }

  events() {
    window.addEventListener("scroll", this.scrollThrottle)
    window.addEventListener(
      "resize",
      debounce(() => {
        console.log("Resize just ran")
        this.browserHeight = window.innerHeight
      }, 333)
    )
  }

  calcCaller() {
    console.log("Scroll function ran")
    this.itemsToReveal.forEach(el => {
      if (el.isRevealed == false) {
        if (window.scrollY + this.browserHeight >= document.body.offsetHeight) {
          this.calculateIfScrolledTo(el, 100)
        } else {
          this.calculateIfScrolledTo(el, this.thresholdPercent)
        }
      }
    })
  }

  calculateIfScrolledTo(el, thresholdPercent) {
    if (window.scrollY + this.browserHeight > el.offsetTop) {
      console.log("Element was calculated")
      let scrollPercent = (el.getBoundingClientRect().top / this.browserHeight) * 100
      if (scrollPercent < thresholdPercent) {
        el.classList.add("reveal-item--is-visible")
        el.isRevealed = true
        if (el.isLastItem) {
          window.removeEventListener("scroll", this.scrollThrottle)
        }
      }
    }
  }

  hideInitially() {
    this.itemsToReveal.forEach((el, index) => {
      el.classList.add("reveal-item")
      el.isRevealed = false
      if (index === this.itemsToReveal.length - 1) {
        el.isLastItem = true
      }
    })
  }
}

export default RevealOnScroll
