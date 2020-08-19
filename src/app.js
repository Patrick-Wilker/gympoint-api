import express from 'express'

import 'express-async-errors' // para o sentry conseguir ver os erros que ocorre no async await . Deve ser importado antes das rotas

import routes from './routes'

import * as Sentry from '@sentry/node'
import sentryConfig from './config/sentry'
import Youch from 'youch' // deixar mais bonitos os erros para os devs

import './database/index'

class App{
    constructor(){
        this.server = express()

        Sentry.init(sentryConfig)

        this.middlewares()
        this.routes()
        this.exceptionHandler()
    }

    middlewares(){
        this.server.use(Sentry.Handlers.requestHandler());

        this.server.use(express.json())

    }

    routes(){
        this.server.use(routes)

        this.server.use(Sentry.Handlers.errorHandler());
    }

    exceptionHandler(){
        this.server.use(async (err, req, res, nex)=>{
            const errors = await new Youch(err, req).toJSON()

            return res.status(500).json(errors)
        })
    }

}

export default new App().server