{
  let view = {
    el: '.page > main',
    init() {
      this.$el = $(this.el)
    },
    template: `
      <form class="form">
      <h1>新建歌曲</h1>
      <div class="row">
        <label>歌名
        </label>
        <input name="name" type="text" value="__name__">
      </div>
      <div class="row">
        <label>歌手
        </label>
        <input name="singer" type="text" value='__singer__'>
      </div>
      <div class="row">
        <label>链接
        </label>
        <input name='url' type="text" value="__url__">
      </div>
      <div class="row actions">
          <label>
          </label>
          <input type="submit">
        </div>
    </form>
    `,
    render(data = {}) {
      // 把歌名和link传进来,填进页面
      let placeholders = ["name",'url','singer',"id"]
      let html = this.template
      placeholders.map((string) => {
        html = html.replace(`__${string}__`, data[string] || '') //兼容,否则输入框中默认出现undefined
      })
      $(this.el).html(html)
    },
    reset(){
      this.render({})
    }
  }
  let model = {
    data: {
      name: '',
      singer: '',
      url: '',
      id: ''
    },
    create(data) {
      // 声明一个 Todo 类型
      var Song = AV.Object.extend('Song');
      // 新建一个 Todo 对象
      var song = new Song();
      song.set('name', data.name);
      song.set('singer', data.singer);
      song.set('url', data.url);
      return song.save().then((newSong) => {
        // 成功保存之后，执行其他逻辑.
        let {
          id,
          attributes
        } = newSong;
        Object.assign(this.data, {
          id,
          ...attributes
          // id = id,
          // name: attributes.name,
          // singer: attributes.singer,
          // url: attributes.url
          // console.log(todo);
        })
      }, (error) => {
        // 异常处理
        console.error(error);
      });
    }
  }

  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      window.eventHub.on('upload', (data) => {
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('select', (data)=>{    //点击对应的歌曲后
        this.model.data = data                  //将传过来的歌曲对应的信息赋值下来
        this.view.render(this.model.data)       //将歌曲信息显示到编辑栏中
      })
    },
    bindEvents() {
      this.view.$el.on('submit', 'form', (e) => { //事件委托
        e.preventDefault();
        let needs = 'name singer url'.split(' ') //得到一个数组
        let data = {}
        needs.map((string) => {
          data[string] = this.view.$el.find(`[name="${string}"]`).val()    //val()一般都是在input中用
        })
        this.model.create(data)
          .then(() => {
            // console.log(this.  model.data)
            this.view.reset()              //新建成功后应该重置扁担中的内容
            let a = JSON.stringify(this.model.data)
            let b = JSON.parse(a)
            window.eventHub.emit('create', b)
          })
      })
    }
  }
  controller.init(view, model)
}