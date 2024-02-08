import Router from 'express'

class AppRoutes {
  constructor(appController, userController) {
	this.router = Router();
	this.appController = appController;
	this.userController = userController;
	this.initializeRoutes();
  }

  initializeRoutes() {
	this.router.get('status', this.appController.getStatus);
	this.router.get('stats', this.appController.getStats);
	this.router.post('users', this.userController.register);
  }
}

export default AppRoutes;
