//index.js
var util = require("../../utils/util.js");

//更改数组 第三个参数是对象
function editArr(arr,i,editCnt){
  let newArr = arr,editingObj = newArr[i];  
  newArr.map(function(a){
     if(a.id == i){
       for (var x in editCnt){
        a[x]= editCnt[x];
      }
     }
  })
  return newArr;
}

//获取应用实例
var app = getApp()
Page({
  data: {  
    userInfo: {},
    showAll:true,
    lists:[],    
    newLi:{content:'',begin:util.formatTime2(),needRemind:1,editing:0,done:0},
    src: 'http://153.37.234.17/mp3.9ku.com/mp3/554/553534.mp3'
  },
   onReady: function (e) {
    this.audioCtx = wx.createAudioContext('myAudio');
   this.remind();
  },
  toUrl(e){
    let url = e.target.dataset.url;
    wx.navigateTo({
      url:'../'+url+'/'+url
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getLists(){
    var that = this, token = app.globalData.token;
    let listUrl = 'http://v2.mashupcloud.cn/LIST/Todos/?appid=548';  
        wx.request({    
            url: listUrl,    
            data: {     
                token: app.globalData.token   
            },
            success: function(res) { 
                that.setData({lists:res.data[2]});
                that.remind();
            }
        })    
  },
  addLists(obj){
     let that = this, token = app.globalData.token, addUrl = 'http://v2.mashupcloud.cn/ADD/Todos/?appid=548' ; 
      obj.token = token;
      if (obj.content){
        wx.request({        
              url: addUrl,
              data:obj, 
              success:function(res) {
                console.log('add ok');  
                that.getLists();          
              },        
              fail: function() {
                  console.log('add fail');                    
              }      
          });
      }
  },
  editLists(i,obj){
     let url = 'http://v2.mashupcloud.cn/EDIT/Todos/'+i+'/?appid=548',that = this, token = app.globalData.token;
     obj.token = token;
       wx.request({        
            url: url,
            data: obj, 
            success:function(res) {
                that.getLists();       
            },        
            fail: function() {
                console.log('edit fail');                    
            }      
        });
  },
  
  deleteLists(i){   
    let deleteUrl = 'http://v2.mashupcloud.cn/DELETE/Todos/'+i+'/?appid=548',that = this, token = app.globalData.token;
     wx.request({        
            url: deleteUrl,  
            data:{token: app.globalData.token},          
            success:function(res) {
                that.getLists(); 
                console.log('delete ok');               
            },        
            fail: function() {
                console.log('delete fail');                    
            }      
        });
  },
  onLoad: function () {
    var that = this;
    this.getLists();
    //获取用户信息
    app.getUserInfo(function(userInfo){
      that.setData({
        userInfo:userInfo
      })
    })    
  },
  iptChange(e){ 
    this.setData({
      'newLi.content':e.detail.value,
      'newLi.begin':util.formatTime2()
    })
  },
 
  formReset(){  
    this.setData({
      'newLi.content':''
    })
  },
  formSubmit(){
    let newLists = this.data.lists,i = 0 ,newTodo = this.data.newLi;
    this.addLists(newTodo);
    this.setData({
        newLi:{content:'',begin:util.formatTime2(),needRemind:1,editing:0,done:0}
      }) 
    this.remind();
  },
  beginTime(e){
     this.setData({
      'newLi.begin': e.detail.value
    })
  },
  switch1Change(e){
    let remindVal = e.detail.value?1:0;
    this.setData({
      'newLi.needRemind': remindVal
    })
  },
  //修改备忘录
  toChange(e){
    let i = e.target.dataset.id;  
    this.editLists(i,{editing:1});   
  },
  iptEdit(e){
    let i = e.target.dataset.id;    
    this.setData({
      lists:editArr(this.data.lists,i,{curVal:e.detail.value})
    })
  },
  saveEdit(e){   
    let i = e.target.dataset.id,thatLists = this.data.lists,curv='';
    thatLists.map(function(l){
      if(l.id == i){
          curv = l.curVal
      }
    })  
     //修改        
      this.editLists(i,{content:curv,editing:0});
  },
  setDone(e){
    let i = e.target.dataset.id,newLists = this.data.lists;
    let newDone;
    newLists.map(function(l,index){      
      if (l.id == i){ 
        newDone = l.done==1?0:1;  
      }
    })  
     this.editLists(i,{done:newDone})      
  },
  toDelete(e){
    let i = e.target.dataset.id,newLists = this.data.lists;
    this.deleteLists(i);
  },
  doneAll(){
    let newLists = this.data.lists,that = this;
    // let doneAllUrl = 'http://v2.mashupcloud.cn/SQL/doneAll/?appid=548';
    //    wx.request({        
    //         url: doneAllUrl,  
    //         data:{token: app.globalData.token,entity:'Todos',name:'doneAll'},          
    //         success:function(res) {
    //             console.log(res);
    //             that.getLists();               
    //         },        
    //         fail: function(res) { 
    //           console.log(res)                         
    //         }      
    //     });
    newLists.map(function(l){
      if(l.done==0){
         that.editLists(l.id,{done:1});
      }      
    })
  },
  deleteAll(){
    let newLists = this.data.lists,that = this;
    let deleteAllUrl = 'http://v2.mashupcloud.cn/SQL/deleteAll/?appid=548'
     wx.request({        
            url: deleteAllUrl,  
            data:{token: app.globalData.token,entity:'Todos',name:'deleteAll'},          
            success:function(res) {
                that.getLists();               
            }   
        }); 
  },
  showUnfinished (){
    this.setData({
      showAll:false
    })
  },
  showAll(){
     this.setData({
      showAll:true   
    })
  },
  saveData(){
    let listsArr = this.data.lists;
    wx.setStorage({
      key:'todolist',
      data:listsArr
    })
  },
  audioPlay: function () {
    this.audioCtx.play()
  },
  audioPause: function () {
    this.audioCtx.pause()
  },
 
  audioStart: function () {
    this.audioCtx.seek(0)
  },  
  getRemindArr(){
    let thisLists=this.data.lists,closeT=0,notDoneLists=[];
    let date = new Date(),now = [date.getHours(),date.getMinutes()];
    if (!thisLists){return false}
    thisLists.map(function(l){
      if(l.needRemind){
        notDoneLists.push(l)
      }
    })
    if (notDoneLists.length>0){
      let newLists = util.sortBy(notDoneLists,'begin'),firstT = (newLists[0].begin).split(':') ,id = newLists[0].id,cnt = newLists[0].content;   
      closeT = ((firstT[0]-now[0])*60+(firstT[1]-now[1])-1)*60;
      closeT = closeT>=0?closeT:0;
      return {closeT,id,cnt};
    }else{
      return false;
    }    
  }, 
  remind(){    
    let result=this.getRemindArr(), t = result.closeT,id = result.id,that=this,cnt = result.cnt;
    function alarm(){
      that.audioPlay();
      let newLists = that.data.lists;
       wx.showModal({
            title: '马上去做吧',
            content: cnt,            
            success: function(res) {
              if (res.confirm) {
                that.audioPause();
                that.audioStart();
                newLists.map(function(l,index){
                  if (l.id == id){ 
                    that.editLists(id,{done:1,needRemind:0}) 
                  }
                })  
               
              }else{
                that.audioPause();
                that.audioStart();
                newLists.map(function(l,index){
                  if (l.id == id){      
                    that.editLists(id,{needRemind:0}) 
                  }
                })  
                
              }
            }
       })

    }
    if(result){      
      setTimeout(alarm,Math.floor(t*1000),function(){
        that.remind();
      })
    }
    
  }
 
  
})
