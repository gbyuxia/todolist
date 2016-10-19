//index.js
//获取应用实例
var app = getApp()
Page({
  data: {  
    userInfo: {},
    curIpt:'',
    showAll:true,
    lists:[]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    app.getUserInfo(function(userInfo){
      that.setData({
        userInfo:userInfo
      })
    })
  },
  iptChange(e){
    this.setData({
      curIpt:e.detail.value
    })
  },
  formReset(){
    this.setData({
      curIpt:''
    })
  },
  formSubmit(){
    let cnt = this.data.curIpt,newLists = this.data.lists,i = newLists.length;
    newLists.push({id:i,content:cnt,done:false});
    this.setData({
      lists:newLists,
      curIpt:''
    }) 
    //this.formReset();   
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
