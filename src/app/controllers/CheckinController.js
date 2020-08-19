import * as Yup from 'yup'
import {subDays, startOfDay, endOfDay } from 'date-fns'
import {Op} from 'sequelize'

import Checkin from '../models/Checkin'
import Student from '../models/Student'

class CheckinController{
    async show(req, res){

        let id =  req.params.id

        const schema = Yup.object().shape({
            id: Yup.number().required()
        })

        if(!(await schema.isValid({id: id}))){
            return res.status(400).json({error: 'Validation fails'})
        }

        const studentExists = await Student.findByPk(id)

        if(!studentExists){
            return res.status(400).json({error: 'Student does not exists'})
        }

        const checkins = await Checkin.findAll({
            where: {
                student_id: id
            }
        })


        return res.json(checkins)
    }

    async store(req, res){

        let id =  req.params.id

        const schema = Yup.object().shape({
            id: Yup.number().required()
        })

        if(!(await schema.isValid({id: id}))){
            return res.status(400).json({error: 'Validation fails'})
        }
 
        const studentExists = await Student.findByPk(id)

        if(!studentExists){
            return res.status(400).json({error: 'Student does not exists'})
        }

        const sevenDaysAgo = subDays(new Date(), 7)

        const students = await Checkin.findAll({
            where:{
                student_id: id,
                created_at: {
                    [Op.between]: [startOfDay(sevenDaysAgo), endOfDay(new Date()) ]
                }
            }
        })

        let qtdCheckins = 0

        students.forEach(student => {
            qtdCheckins++
        });

        if(qtdCheckins >= 5){
            return res.status(400).json({error: 'Student performed 5 checkins in the last 7 days'})
        }

        const student = await Checkin.create({
            student_id: id
        })

        return res.json(student)
    }
}

export default new CheckinController()