//index.js
var dataUrl = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
var util = require("../../utils/util.js");


//获取应用实例
var app = getApp()
Page({
  data: {  
    userInfo: {},
    curIpt:'',
    showAll:true,
    lists:[],
    curRange:[],
    curBegin:0,
    curFinish:1
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    //获取之前保留在缓存里的数据
    wx.getStorage({
      key: 'todolist',
      success: function(res) {
        if(res.data){
           that.setData({
            lists:res.data
          })
        }
      } 
    })
    //获取用户信息
    app.getUserInfo(function(userInfo){
      that.setData({
        userInfo:userInfo
      })
    })
  },
  iptChange(e){ 
    let timeArr = util.setTimeHalf();   
    this.setData({
      curIpt:e.detail.value,
      curRange:timeArr
    })
  },
  formReset(){
    this.setData({
      curIpt:'',
      curRange:[]
    })
  },
  formSubmit(){
    let cnt = this.data.curIpt,newLists = this.data.lists,i = newLists.length,begin=this.data.curRange[this.data.curBegin],finish = this.data.curRange[this.data.curFinish];
    newLists.push({id:i,content:cnt,done:false,beginTime:begin,finishTime:finish});
    this.setData({
      lists:newLists,
      curIpt:''
    }) 
    //this.formReset();   
  },
  beginChange(e){
     this.setData({
      curBegin: e.detail.value,
      curFinish: Number(e.detail.value)+1
    })
  },
  finishChange(e){
    this.setData({
      curFinish: e.detail.value
    })
  },
  setDone(e){
    let i = e.target.dataset.id,newLists = this.data.lists;
      newLists[i].done = !newLists[i].done;
      this.setData({
        lists:newLists
      })
  },
  toDelete(e){
    let i = e.target.dataset.id,newLists = this.data.lists;
    newLists.map(function(l,index){
      if (l.id == i){      
        newLists.splice(index,1);
      }
    })   
    this.setData({
        lists:newLists
      })
  },
  doneAll(){
    let newLists = this.data.lists;
    newLists.map(function(l){
      l.done = true;
    })   
    this.setData({
        lists:newLists
      })
  },
  deleteAll(){
    this.setData({
        lists:[]
      })
  },
  showNoDone(){
    //只显示未完成事项
   // let newLists = this.data.lists,allListArr = this.data.lists;
    
    // newLists.map(function(l,index){
    //   if (l.done){
    //     newLists.splice(index,1);
    //   }
    // })
    this.setData({
      showAll:false
    })
  },
  showAll(){
    //显示全部事项

     this.setData({
      showAll:true,
     // lists:this.data.allLists
    })
  },
  saveData(){
    let listsArr = this.data.lists;
    wx.setStorage({
      key:'todolist',
      data:listsArr
    })
  }
  
})
