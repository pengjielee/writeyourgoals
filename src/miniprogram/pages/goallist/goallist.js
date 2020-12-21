// miniprogram/pages/goal/goal.js
const app = getApp();
var util = require('../../utils/index.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goals: [],
    max: 15,
    isShowAdd: false,
    isLoaded: true,
    isShowSettings: false,
    themes: [
      { id: 1, name: '科技黑', code: 'black', value: '#212121', color: '' },
      { id: 2, name: '高贵紫', code: 'purple', value: '#d1c4e9', color: '' },
      { id: 3, name: '可爱粉', code: 'pink', value: '#f8bbd0', color: '' },
      { id: 4, name: '护眼绿', code: 'green', value: '#c8e6c9', color: '' },
      { id: 5, name: '商务灰', code: 'gray', value: '#cfd8dc', color: '' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  handleSettingShow: function(){
    this.setData({
      isShowSettings: true
    })
  },

  handleSettingHide: function(){
    this.setData({
      isShowSettings: false
    })
  },

  onThemeChange: function(e){
    const theme = e.detail.value;
    try {
      wx.setStorageSync('theme', theme)
      this._updateTheme(theme)
    } catch (e) { }
  },

  _getTheme: function(){
    try {
      const theme = wx.getStorageSync('theme') || '#c8e6c9'
      this._updateTheme(theme)
    } catch (e) { }
  },

  _getGoals: function(){
    const me = this;
    const db = wx.cloud.database();
    wx.showLoading({
      title: '努力加载中...',
      mask: true
    })
    db.collection('goals').orderBy('toptime','desc').orderBy('date','desc').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        var goals = res.data.map(function(item,index){
          item.date = util.formatTime(item.date)
          return item;
        })

        var isShowAdd = res.data.length < me.data.max;
        this.setData({
          goals: goals,
          isShowAdd: isShowAdd,
          isLoaded: true
        })
      },
      fail: err => {
      },
      complete: res => { 
        wx.hideLoading()
      }
    })
  },

  _updateTheme: function(theme){
    var themes = this.data.themes;
    themes.map(function(item,index){
      if(item.value === theme){
        item.checked = true;
      }else{
        item.checked = false;
      }
      return item;
    })

    if(theme === '#212121') {
      themes.map(item => {
        item.color = '#fff';
        return item;
      })
    } else {
      themes.map(item => {
        item.color = '';
        return item;
      })
    }

    this.setData({
      theme: theme,
      themes: themes,
      isShowSettings: false
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: theme,
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },

  handleGoalTap: function(e){
    var goals = this.data.goals;
    var id = e.currentTarget.dataset.id;

    goals.map(function(item,idx){
      if(item._id === id){
        item.control = true;
      }else{
        item.control = false;
      }
    })

    this.setData({ goals: goals })
  },

  handleGoalTop: function(e){
    var me = this;
    var id = e.currentTarget.dataset.id;
    const db = wx.cloud.database()
    db.collection('goals').doc(id).update({
      data:{
        istop: true,
        toptime: new Date()
      },
      success: res => {
        wx.showToast({
          title: '置顶成功',
          success: function(){
            setTimeout(function(){
              me._getGoals();
            },500)
          }
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '置顶失败',
        })
      }
    })
  },

  handleGoalDelete: function(e){
    var me = this;
    var id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认删除?',
      content: '即将删除该目标，删除后不可恢复',
      success: function(res){
        if(res.confirm){
          const db = wx.cloud.database()
          db.collection('goals').doc(id).remove({
            success: res => {
              wx.showToast({
                title: '删除成功',
                success: function(){
                  setTimeout(function(){
                    me._getGoals();
                  },500)
                }
              })
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '删除失败',
              })
            }
          })
        }
      }
    })
  },

  handleGoalAdd: function(){
    wx.navigateTo({ 
      url: '/pages/goaladd/goaladd'
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
    this._getTheme();
    this._getGoals();
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