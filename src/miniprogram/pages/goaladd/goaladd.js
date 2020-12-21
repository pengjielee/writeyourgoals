// miniprogram/pages/goaladd/goaladd.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tpls: [
      '我要阅读20本书。' ,
      '我要跑步200公里。' ,
      '我要记单词2000个。' ,
      '我要拍摄200张图片。' ,
      '我要学习吉他。' ,
      '我要去日本旅行。' ,
      '我要骑行100公里。'
    ],
    isShowTpls: false,
    goal: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      const theme = wx.getStorageSync('theme') || '#c8e6c9'
      this.setData({
        theme: theme
      })
    } catch (e) { }
  },

  handleImportTap: function(){
    this.setData({
      isShowTpls: true
    })
  },

  handleOverlayTap: function(){
    this.setData({
      isShowTpls: false
    })
  },

  handleTplTap: function(e){
    var idx = e.currentTarget.dataset.idx;
    var text = this.data.tpls[idx];
    this.setData({
      goal: text,
      isShowTpls: false
    })
  },

  handleBack: function(){
    wx.navigateBack({
      delta: 1
    })
  },

  handleSubmit: function(e){
    var goal = e.detail.value.goal;
    if(!goal){
      wx.showToast({
        title: '请填写目标',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const db = wx.cloud.database()
    db.collection('goals').add({
      data: {
        openid: app.globalData.openid,
        goal: goal,
        date: new Date(),
        status: 1
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '创建成功',
          success: function(){
            wx.navigateTo({
              url: '/pages/goallist/goallist'
            })
          }
        });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '创建失败'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})