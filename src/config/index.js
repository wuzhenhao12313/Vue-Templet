export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '破浪电子商务应用系统',
  appCode: 'APP', // 系统编号
  homePage: '/dashboard/workplace', // 首页
  url: {
    cdn: 'http://cdn.polelong.com', // 资源服务器
    imgServer: 'http://erpimg1.polelong.com', // 图片服务器
    uploadApi: 'http://fxServer.polelong.com/Uploader', // 上传接口
    localUploadApi: 'http://fxServer.lpole.com/Uploader', // 本地上传接口
    dev: {
      home: 'http://oa.lpole.com:8084/', // 前端路由
      service: 'http://fxServer.lpole.com',
      api: 'http://fxServer.lpole.com/api',
      loginApi: 'http://login.lpole.com:8082/#/user/login'
    },
    prod: {
      home: 'http://oa.polelong.com/', // 前端路由
      service: 'http://fxServer.polelong.com',
      api: 'http://fxServer.polelong.com/api',
      loginApi: 'http://login.polelong.com/#/user/login'
    }
  },
  getUrl: function (key) {
    if (process.env.NODE_ENV === 'production') {
      return this.url.prod[key]
    } else {
      return this.url.dev[key]
    }
  },

  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: true,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: 'https://www.easy-mock.com/mock/5add9213ce4d0e69998a6f51/iview-admin/',
    pro: 'https://produce.com'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  }
}
