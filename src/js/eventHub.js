
window.eventHub = {
  events : {      //hash
    // "哈哈":[fn],
    // '嘿嘿':[]
  },
  init(){

  },
  emit(eventName, data){     //发布  叫trigger亦可     订阅的事件   后者为相关数据
    for(let key in this.events){
      if(key === eventName){
        let fnList = this.events[key]
        fnList.map((fn)=>{
          fn.call(undefined,data)
        })
      }
    }
  },
  on(eventName, fn){        //订阅     eventName即  订阅  事件的name, fn为订阅之后执行要执行的函数
    if(this.events[eventName] === undefined){      //如果对应的key未定义
      this.events[eventName] = []                   //就初始化他
    }
    this.events[eventName].push(fn)                 //然后向key对应的值中push传入的函数

  },
  off(){},
}


