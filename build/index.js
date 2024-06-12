"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const listProductsRoutes_1 = __importDefault(require("./routes/listProductsRoutes"));
const managementProductsRoutes_1 = __importDefault(require("./routes/managementProductsRoutes"));
const login_1 = __importDefault(require("./routes/login"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const listComprasRoutes_1 = __importDefault(require("./routes/listComprasRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        dotenv.config();
        this.app.set('port', process.env.PORT || 3000);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use(listProductsRoutes_1.default);
        this.app.use(managementProductsRoutes_1.default);
        this.app.use(login_1.default);
        this.app.use(usersRoutes_1.default);
        this.app.use(listComprasRoutes_1.default);
        this.app.use(paymentRoutes_1.default);
        this.app.use(contactRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server esta en el puerto ', this.app.get('port'));
            console.log('Dar clic en --> http://localhost:3000');
        });
    }
}
const server = new Server();
server.start();
