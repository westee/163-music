{
  let view = {
    el: ".songList-container",
    template: `
      <ul class="songList">
      </ul>
    `,
    render(data) {
      let $el = $(this.el)
      $el.html(this.template)
      let {
        songs,
        selectedSongId
      } = data
      let liList = songs.map((song) => {
        let $li = $('<li></li>').text(song.name).attr('data-song-id', song.id) //将id添加到li中
        if (song.id === selectedSongId) {
          $li.addClass('active')
        }
        return $li
      })
      $el.find('ul').empty()
      liList.map((domLi) => {
        $el.find('ul').append(domLi)
      })
    },
    // activeItem(e) { //为li增加激活态
    //   let $li = $(e.currentTarget)
    //   $li.addClass('active')
    //     .siblings('.active').removeClass('active')
    // },
    clearActive() {
      $(this.el).find('.active').removeClass("active")
    }
  }

  let model = {
    data: {
      songs: []
    },
    find() {
      var query = new AV.Query('Song');
      return query.find().then((songs) => {
        this.data.songs = songs.map((song) => {
          return {
            id: song.id,
            ...song.attributes
          }
        })
        return songs //得到什么就return什么
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEventHub()
      this.bindEvents()
      this.getAllSongs()
    },
    getAllSongs() {
      return this.model.find().then(() => {
        this.view.render(this.model.data)
      })
    },
    bindEvents() {
      $(this.view.el).on('click', 'li', (e) => { //如果用户点击了一个li
        // this.view.activeItem(e)
        let songId = e.currentTarget.getAttribute('data-song-id') //为li添加data-song-id信息

        this.model.data.selectedSongId = songId
        this.view.render(this.model.data)

        let data
        let songs = this.model.data.songs
        for (let i = 0; i < songs.length; i++) { //找到songId对应的歌曲
          if (songs[i].id === songId) {
            data = songs[i]
            break
          }
        }
        window.eventHub.emit('select', JSON.parse(JSON.stringify(data))) //经深拷贝后将所选歌曲的所有数据传过去
      })
    },
    bindEventHub() {
      window.eventHub.on('create', (songData) => {
        this.model.data.songs.push(songData)
        this.view.render(this.model.data)
      })
      window.eventHub.on('new', () => {
        this.view.clearActive()
      })
      window.eventHub.on('update', (song) => {
        console.log(song)
        let songs = this.model.data.songs //将songList中model下的songs数据保存到songs中
        for (let i = 0; i < songs.length; i++) {
          if (songs[i].id === song.id) { //将songs中的歌曲id逐个和传进来的歌曲id进行对比
            Object.assign(songs[i], song) //找到后用传进来的数据覆盖掉本地的数据
          }
        }
        this.view.render(this.model.data) //然后重新render要显示的数据
      })
    }
  }
  controller.init(view, model)
}