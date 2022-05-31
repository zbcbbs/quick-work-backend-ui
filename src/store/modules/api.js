// 适配 Nginx 反向代理
const baseUrl = process.env.VUE_APP_BASE_API === '/' ? '' : process.env.VUE_APP_BASE_API
const api = {
  state: {
    // Sql 监控
    sqlApi: baseUrl + '/druid/index.html',
    // swagger
    swaggerApi: baseUrl + '/doc.html',
    // 实时控制台
    socketApi: baseUrl + '/websocket?token=kl',
    // 部署包上传
    deployUploadApi: baseUrl + '/api/deploy/upload',
    // sql脚本上传
    databaseUploadApi: baseUrl + '/api/database/execute',
    // 编辑器图片上传
    imagesUploadApi: baseUrl + '/api/cos/files',
    // 修改头像上传
    updateAvatarApi: baseUrl + '/api/users/updateAvatar',
    // 上传到腾讯云
    cosUploadApi: baseUrl + '/api/cos/files',
    // 上传到本地磁盘
    localUploadApi: baseUrl + '/api/local/files',
    // 项目访问根路径
    baseApi: baseUrl
  }
}

export default api
