{
  let view = {
    el:'.songs',
    init(){
      this.$el = $(this.el)
    },
    render(data){
      // let {songs} = data    解构赋值
      let songs = data.songs
      console.log("here")
      console.log(data)
      console.log(songs)
      songs.map((song)=>{
        let $li = $(`
          <li>
            <h3>${song.name}</h3>
            <p>
              <svg class="icon icon-sq">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-sq"></use>
              </svg>
              ${song.singer}
            </p>
            <a class="playButton" href='./song.html?id=${song.id}'>
              <svg class='icon icon-play'>
                <use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href="#icon-play"></use>
              </svg>
            </a>
          </li>
              
        `)
        console.log($li)
        this.$el.find('ol.list').append($li)
      })

    }
  }
  let model = {
    data:{
      songs: []
    },
    find(){
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
    init(view ,mdoel){
      this.view = view 
      this.view.init()
      this.model = model
      this.model.find().then(()=>{
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}