//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    //ashupcloud的app认证  
    this.auth();
  }
  ,auth: function() {
        var that = this;
        var url="http://hw.mashupcloud.cn/developer/auth.do";        
        wx.request({
            url: url,
            data:{
                appkey:'uIGEpAlENMmzZDLFtxmEAnrlwCtqDkNI' , 
                appsecret: 'nAQTWJMEnzuwVjLQkWivnILQWnoNPOiS'
            },
            success: function(res) {                 
                //返回格式：[“OK”,“token”]      
                var token = res.data[1];      
                that.globalData.token = token ;   
            }
        }) 
    },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    backgroundAudioPlaying:true,
    token:''
  }
})