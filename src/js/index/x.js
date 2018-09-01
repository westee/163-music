{
  let view = {
    el: '#app',
    init() {
      this.$el = $(this.el)
    },
    render(data) { //局部更新
      let {
        song,
        status
      } = data
      this.$el.css("background", `url(${song.cover}) center no-repeat `); //播放时的专辑背景
      this.$el.css('background-size', 'cover')
      this.$el.find('img.cover').attr('src', song.cover) //旋转的封面
      this.$el.find('h1').text(`${song.name}`)
      if (this.$el.find('audio').attr('src') !== song.url) {
        let audio = this.$el.find('audio').attr('src', song.url).get(0)
        audio.onended = () => {
          window.eventHub.emit('songEnd')
        }
        audio.ontimeupdate = () => {
          this.showLyric(audio.currentTime)
        }
      }
      if (status === 'playing') {
        this.$el.find('.disc-container').addClass('playing')
      } else {
        this.$el.find('.disc-container').removeClass('playing')
      }
      // this.$el.find('.song-description>h1').text()
      let {
        lyrics
      } = song
      let array = lyrics.split('\n').map((string) => {
        let p = document.createElement('p')
        let regex = /\[([\d:.-]+)\](.+)/
        let matches = string.match(regex)
        if (matches) {
          p.textContent = matches[2] //match的第二项是歌词
          let time = matches[1]
          let parts = time.split(':')
          let minute = parts[0]
          let seconds = parts[1]
          let newTime = parseInt(minute, 10) * 60 + parseFloat(seconds, 10)
          p.setAttribute('data-time', newTime) //match的第一项是时间
        } else {
          p.textContent = string
        }
        return p
      })
      this.$el.find('.lyric>.lines').append(array)

    },
    showLyric(time) {
      let allP = this.$el.find('.lyric>.lines>p')
      this.$el.find('.lyric').css('border',"1px solid cyan")     
      for (let i = 0; i < allP.length; i++) {
        if(i === allP.length-1){
          break
        }else{
          let currentTime = allP.eq(i).attr('data-time')
          let nextTime = allP.eq(i+1).attr('data-time')
          if (time > currentTime && time < nextTime){
            let p = allP[i]
            let pHeight = p.getBoundingClientRect().top
            let linesHeight = this.$el.find('.lyric>.lines')[0].getBoundingClientRect().top
            let height = pHeight- linesHeight
            console.log(height)
            this.$el.find('.lyric>.lines').css({
              transform: `translateY(${-height}px)`
            })
            // console.log(allP[i])
            break
          }
        }
      }
    },
    play() {
      this.$el.find('audio')[0].play()
    },
    pause() {
      this.$el.find('audio')[0].pause()
    }
  }
  let model = {
    data: {
      song: {
        id: '',
        name: '',
        singer: '',
        url: '',
        lyrics: ''
      },
      status: 'paused'
    },
    setId(data) {
      this.data.id = data
    },
    get() {
      var query = new AV.Query('Song');
      return query.get(this.data.id).then((song) => {
        // 成功获得实例
        Object.assign(this.data.song, {
          id: song,
          ...song.attributes
        })
        return song
        // todo 就是 id 为 57328ca079bc44005c2472d0 的 Todo 对象实例
      }, function (error) {
        console.log(error)
        // 异常处理
      });
    }
  }
  let controller = {
    init(view, model) {
      this.model = model
      this.view = view
      this.view.init()
      let id = this.getSongId()
      this.model.setId(id)
      this.model.get().then((data) => { //从leancloud获得的信息
        this.view.render(this.model.data)
        // this.view.play()
        // console.log(this.model.data)
      })
      this.bindEvents()
    },
    bindEvents() {
      $(this.view.el).on('click', '.icon-play', () => {
        this.model.data.status = 'playing'
        this.view.render(this.model.data)
        this.view.play()
      })
      $(this.view.el).on('click', '.icon-pause', () => {
        this.model.data.status = 'pause'
        this.view.render(this.model.data)
        this.view.pause()
      })
      window.eventHub.on('songEnd', () => {
        this.model.data.status = 'pause'
        this.view.render(this.model.data)
      })
    },
    getSongId() {
      let search = window.location.search
      if (search.indexOf('?') === 0) {
        search = search.substring(1)
      }
      let array = search.split('&').filter((v => v))
      let id
      for (let i = 0; i < array.length; i++) {
        let kv = array[i].split('=')
        var k = kv[0]
        var v = kv[1]
        if (k === 'id') {
          id = v
        }
      }
      // 以上代码用来获得id
      return id
    }
  }
  controller.init(view, model)
}