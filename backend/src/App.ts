import * as express from 'express'

class App {
  public app;

  constructor () {
    this.app = express();
    this.mountRoutes();
  }

  private mountRoutes (): void {
    const router = express.Router();
    router.get('/:code', (req, res) => {
      res.json({
        message: `Resquested ${req.params.code}`
      });
      console.log(`Resquested ${req.params.code}`);
      console.log("please work")
    });
    this.app.use('/', router);
  }
}

export default new App().app