const target = 'http://10.73.202.166:8080';

export default {
  '/message-center': {
    target,
    changeOrigin: true,
    secure: false,
    pathRewrite: { '/message-center': '' },
    headers: {
      Origin: target,
      // Referer: target, // 开发环境暂时注释，为了后端移除 local，达到 cookie 共享
    },
    bypass(req: Record<string, any>) {
      req.headers.host = target.replace(/https?:\/\//, '');
      // console.log(req)
    },
  }
};

