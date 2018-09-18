{



  let view = {
    el: '.page-1',
    init() {
      this.$el = $(this.el)
    },
    show() {
      this.$el.addClass('active')
    },
    hide() {
      this.$el.removeClass('active')
    }
  }
  let model = {

  }
  let controller = {
    init(view, model) {
      this.model = model
      this.view = view
      this.view.init()
      this.loadModule1()
      this.loadModule2()
      this.bindEventHub()
    },
    bindEventHub() {
      window.eventHub.on('selectTab', (tabName) => {
        console.log(tabName)
        if (tabName === 'page-1') {
          this.view.show()
        } else {
          this.view.hide()
        }
      })
    },
    loadModule1() {
      let script1 = document.createElement('script')
      script1.src = './js/index/page1-1.js'
      script1.onload = function () {
      }
      document.body.appendChild(script1)
    },
    loadModule2() {
      let script2 = document.createElement('script')
      script2.src = './js/index/page1-2.js'
      script2.onload = function () {
        console.log(2)
      }
      document.body.appendChild(script2)
    }
  }
  controller.init(view, model)
}