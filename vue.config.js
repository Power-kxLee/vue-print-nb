/*
 * @Author: lee
 * @Date: 2021-05-12 15:55:17
 * @LastEditors: lee
 * @LastEditTime: 2021-05-12 15:57:30
 * @Description: file content
 */
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '',
  css: {
    extract: false
  }
}