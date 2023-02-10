// 负责 comment 相关的路由接口
const Router = require('koa-router');
const {
  verifyAuth,
  verifyPermission,
} = require('../middleware/auth.middleware');

const {
  create,
  reply,
  update,
  remove,
  list,
} = require('../controller/comment.controller.js');

const commentRouter = new Router({ prefix: '/comment' });

commentRouter.post('/', verifyAuth, create);
commentRouter.post('/:commentId/reply', verifyAuth, reply);

// 修改评论
// 并不能直接使用 verifyPermission，因为之前是检测动态是否有权限，而不是评论是否有权限
commentRouter.patch(
  '/:commentId',
  verifyAuth,
  verifyPermission,
  update
);

// 删除评论
commentRouter.delete(
  '/:commentId',
  verifyAuth,
  verifyPermission,
  remove
);

// 获取评论列表
commentRouter.get('/', list);

module.exports = commentRouter;
