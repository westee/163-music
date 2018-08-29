{
  let view = {
    el: '.page > main',
    init() {
      this.$el = $(this.el)
    },
    template: `
      <form class="form">
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
      let placeholders = ["name", 'url', 'singer', "id"]
      let html = this.template
      placeholders.map((string) => {
        html = html.replace(`__${string}__`, data[string] || '') //兼容,否则输入框中默认出现undefined
      })
      // $(this.el).prepend('<h1>编辑歌曲</h1>')
      $(this.el).html(html)
      if (data.id !== "") {
        //根据有无id来判断是新建状态还是编辑状态
        $(this.el).prepend('<h1>编辑歌曲</h1>')
      } else {
        $(this.el).prepend('<h1>新建歌曲</h1>')
      }
    },
    reset() {
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
    update(data){
      // 第一个参数是 className，第二个参数是 objectId
      
      var song = AV.Object.createWithoutData('Song', this.data.id);
      // 修改属性
      song.set('name', data.name );
      song.set('singer', data.singer );
      song.set('url', data.url );
      // 保存到云端
      return song.save().then((response)=>{
        Object.assign(this.data, data)
        return response
      }) 
    },
    create(data) {
      // 声明一个 Song 类型
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
      window.eventHub.on('select', (data) => { //点击对应的歌曲后
        this.model.data = data //将传过来的歌曲对应的信息赋值保存到this.model.data
        this.view.render(this.model.data) //将歌曲信息显示到编辑栏中
      })
      window.eventHub.on('new', (data) => {
        // if(data === undefined){
        //   this.model.data = {}                  //点击新建歌曲后要把编辑栏清空所以设置空字符串
        // }
        if (this.model.data.id !== "") {
          this.model.data = {
            "name": '',
            "url": '',
            "id": "",
            "singer": ''
          }
        } else {
          Object.assign(this.model.data, data)
        }
        // this.model.data = data        
        this.view.render(this.model.data) // 并且重新渲染到页面上并重新判断是新建状态还是编辑状态
      })
    },
    create() {
      let needs = 'name singer url'.split(' ') //得到一个数组
      let data = {}
      needs.map((string) => {
        data[string] = this.view.$el.find(`[name="${string}"]`).val() //val()一般都是在input中用
      })
      this.model.create(data)
        .then(() => {
          this.view.reset() //新建成功后应该重置扁担中的内容
          let a = JSON.stringify(this.model.data)
          let b = JSON.parse(a)
          window.eventHub.emit('create', b)
        })
    },
    update() {
      let needs = 'name singer url'.split(' ') //得到一个数组
      let data = {}
      needs.map((string) => {
        data[string] = this.view.$el.find(`[name="${string}"]`).val() //val()一般都是在input中用
      })
      this.model.update(data)
        .then(()=>{
          alert('更新成功')
          console.log(JSON.parse(JSON.stringify(this.model.data)))
          window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)) )
        })
    },
    bindEvents() {
      this.view.$el.on('submit', 'form', (e) => { //事件委托

        e.preventDefault();

        if (this.model.data.id) {
          console.log("id存在")
          this.update()
        } else {
          console.log("id不存在")
          this.create()
        }

      })
    }
  }
  controller.init(view, model)
}