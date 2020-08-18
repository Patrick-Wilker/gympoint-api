//conecanto os models com o banco de dados (sequelize) e carregar os models

import Sequelize from 'sequelize'

import User from '../app/models/User'
import Student from '../app/models/Student'
import Plan from '../app/models/Plan'
import Registration from '../app/models/Registration'

import databaseConfig from '../config/database'

const models = [User, Student, Plan, Registration] // carregar os modelos

class Database{
    constructor(){
        this.init()
    }
    init(){
        this.connection = new Sequelize(databaseConfig) // passando os dados para conexao com o bd

        models
            .map(model => model.init(this.connection))
            .map(model => model.associate && model.associate(this.connection.models))
    }
}

export default new Database()