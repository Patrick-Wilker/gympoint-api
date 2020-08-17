import jwt from 'jsonwebtoken'
import {promisify} from 'util'

import authConfig from '../../config/auth'

export default async (req, res, next)=>{

    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.status(401).json({error: 'Token not provided'})
    }

    const [, token] = authHeader.split(' ')

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret)//para retornar somente o id, o iat , e data de expiração no exp
        
        req.userId = decoded.id // pegar o id objeto decoded e guardar numa variavel que posso ser usada quando ele já estiver autenticado

        return next()

    } catch (err) {
        return res.status(401).json({error: 'Token invalid'})
    }

}