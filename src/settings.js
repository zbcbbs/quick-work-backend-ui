/*
  全局参数配置
 */
module.exports = {
  title: '企业快速开发平台', // 网站标题
  tagsView: true, // 显示 TagsView 页签
  fixedHeader: true, // 固定头部
  tokenCookieExpires: 1, // 记住密码 令牌在Cookie中存储有效期 单位：天数
  passCookieExpires: 1, // 记住密码 密码在Cookie中存储有效期 单位：天数
  uniqueOpened: true, // 是否只保持一个子菜单的展开
  TokenKey: 'JWT-TOEKN', // 令牌缓存标记
  timeout: 120000, // 请求超时时间 单位：毫秒
  sidebarLogo: true, // 显示LOGO
  showFooter: true, // 显示底部信息
  footerTxt: '© 2022 暴走编程 <a href="http://www.zbcbbs.com/" target="_blank">北辰</a>', // 底部版权信息 支持html格式
  caseNumber: '鲁ICP备20016542号', // 备案号
  showTopNavbar: true, // 显示顶部导航路由
  passEncrypt: false // 密码加密
}
