{
  let view = {
    el: '#tabs',
    init() {
      this.$el = $(this.el)
    }
  }
  let model = {

  }
  let controller = {
    init(view) {
      this.view = view
      this.view.init()
      this.model = model
      this.bindEvents()
    },
    bindEvents() {
      this.view.$el.on('click', '.tabs-nav > li', (e) => {
        let $li = $(e.currentTarget);             //别忘了用$（jq）封装哟
        let pageName = $li.attr('data-tab-Name')
        console.log(pageName)
        $li.addClass('active')
          .siblings().removeClass('active')
          window.eventHub.emit('selectTab',pageName)
      })
    }
  }
  controller.init(view)
}