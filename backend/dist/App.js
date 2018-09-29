"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class App {
    constructor() {
        this.app = express();
        this.mountRoutes();
    }
    mountRoutes() {
        const router = express.Router();
        router.get('/:code', (req, res) => {
            res.json({
                message: `Resquested ${req.params.code}`
            });
            console.log(`Resquested ${req.params.code}`);
        });
        this.app.use('/', router);
    }
}
exports.default = new App().app;
//# sourceMappingURL=App.js.map