import Router from 'express';

class AppRoutes {
  constructor(
    appController,
    userController,
    authController,
    authMiddleware,
    fileController,
  ) {
    this.router = Router();
    this.appController = appController;
    this.userController = userController;
    this.authController = authController;
    this.authMiddleware = authMiddleware;
    this.fileController = fileController;
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('status', this.appController.getStatus);
    this.router.get('stats', this.appController.getStats);
    this.router.post('users', this.userController.register);
    this.router.get(
      'connect',
      this.authMiddleware.authenticate,
      this.authController.getConnect,
    );
    this.router.get('disconnect', this.authController.getDisconnect);
    this.router.get(
      'users/me',
      this.authMiddleware.authenticate,
      this.userController.getMe,
    );
    this.router.post(
      'files',
      this.authMiddleware.authenticate,
      this.fileController.postUpload,
    );
  }
}

export default AppRoutes;
