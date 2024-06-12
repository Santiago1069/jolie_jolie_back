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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const jwt = __importStar(require("jsonwebtoken"));
require('dotenv').config;
class ValidateToken {
    validate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const header_token = req.headers['authorization'];
            if (header_token != undefined && header_token.startsWith('Bearer ')) {
                //tiene token
                try {
                    const bearer_token = header_token.slice(7);
                    //estas dos variables deben de ir en el archivo .env
                    const secret_key1 = "ZYElJo_60K$98b[y$dgr4EQ[l";
                    const secret_key2 = "i0G^OV~oaHnWZw$wXNF}2hJ.P";
                    if (!secret_key1 || !secret_key2) {
                        console.error('Las variables de entorno TOKEN_SECRET_KEY1 o TOKEN_SECRET_KEY2 no están definidas.');
                        process.exit(1);
                    }
                    jwt.verify(bearer_token, secret_key1 || secret_key2);
                    next();
                }
                catch (error) {
                    res.status(401).json({
                        msg: 'token no valido'
                    });
                }
            }
            else {
                res.status(401).json({
                    msg: 'Acceso denegado'
                });
            }
        });
    }
}
exports.validateToken = new ValidateToken();
