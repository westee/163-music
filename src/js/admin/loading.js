{
  let view = {
    el: '#site-loading',
    show(){
      console.log(2)
      console.log($(this.el))
      $(this.el).addClass('active')
    },
    hide(){
      $(this.el).removeClass('active')
    }
  }
  let controller = {
    init(view){
      this.view = view
      console.log(3)
      console.log(this.view)
      this.bindEventHub()
    },
    bindEventHub(){
      window.eventHub.on('beforeUpload', ()=>{
        this.view.show()
      })
      window.eventHub.on('afterUpload', ()=>{
        this.view.hide()
      })
    }
  }
  console.log(1)
  console.log($(view.el))
  controller.init(view)
}