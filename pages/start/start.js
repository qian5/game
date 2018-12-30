//index.js

//获取应用实例

const app = getApp()



Page({

  data: {

    motto: '你选择的游戏',

    userInfo: {},

    hasUserInfo: false,

    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    tempFilePaths: null,

  },



  //确定图片来源，从相册中选择或者是拍照

  chooseimage: function () {

    var that = this;

    wx.showActionSheet({

      itemList: ['从相册中选择'],

      itemColor: "#CED63A",

      success: function (res) {

        if (!res.cancel) {

          if (res.tapIndex == 0) {

            that.chooseWxImage('album')

          } 

        }

      }

    })



  },



  //选择图片

  chooseWxImage: function (type) {

    var that = this;

    wx.chooseImage({

      sizeType: ['original', 'compressed'],

      sourceType: [type],

      success: function (res) {

        console.log(res);

        that.setData({

          tempFilePaths: res.tempFilePaths,

        })

      }

    })

  },



  //上传图片至服务器并接受返回的结果

  identifyimage: function () {

    var that = this;

    wx.uploadFile({

      url: 'http://140.143.75.215:8000', //换成自己的接口地址

      filePath: that.data.tempFilePaths[0],

      name: 'image',

      header: { "Content-Type": "multipart/form-data" },

      success: function (res) {

        console.log(res)

        var data = JSON.parse(res.data) //把返回结果解析成json格式

        //console.log(data)



        if (data.data.errormsg != "OK") {

          //识别失败，提示上传质量更好的图片

          wx.showModal({

            title: '提示',

            content: '识别失败，请上传质量更好的图片',

            success: function (res) {

              if (res.confirm) {

                console.log('用户点击确定')

              } else if (res.cancel) {

                console.log('用户点击取消')

              }

            }

          })

        } else {

          //识别成功，拼接识别结果并显示

          var list = data.data.items

          var str = ""

          for (var i = 0; i < list.length; i++) {

            str += list[i].itemstring + " "

          }

          that.setData({

            motto: str

          })

          //如果识别结果为“猜拳 ”，进入猜拳小游戏界面
          if (str == "猜拳 ") {
            wx.navigateTo({

              url: '../shitoujiandaobu/shitoujiandaobu',

            })

            
           //如果识别结果为“贪吃蛇 ”，进入贪吃蛇小游戏界面
          }
          else if (str == "贪吃蛇 ") {
            wx.navigateTo({

              url: '../snake/snake',

            })

          } 
          //如果识别结果为“2048 ”，进入2048小游戏界面
          else if (str == "2048 ") {
            wx.navigateTo({

              url: '../2048/2048',

            })
          //如果识别结果不是这三个游戏，给出提示
          }else {


            wx.showModal({

              title: '提示',

              content: '没有这个小游戏哦，亲',

              success: function (res) {

                if (res.confirm) {

                  console.log('用户点击确定')

                } else if (res.cancel) {

                  console.log('用户点击取消')

                }

              }

            })

          }



        }

      }

    })

  },



  onLoad: function () {
    //验证口令
    wx.showModal({

      title: '验证口令',

      content: '请上传一张含有小游戏名称 的图片，识别成功则可以开始游戏。',

      success: function (res) {

        if (res.confirm) {

          console.log('用户点击确定')

        } else if (res.cancel) {

          console.log('用户点击取消')

        }

      }

    })
  }
})