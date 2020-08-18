import * as Yup from 'yup'
import {parseISO, isBefore, addMonths} from 'date-fns'

import Registration from '../models/Registration'
import Student from '../models/Student'
import Plan from '../models/Plan'

class RegistrationController{

    async index(req, res){

        const registrations = await Registration.findAll({
            attributes: ['id', 'student_id', 'plan_id', 'start_date', 'end_date', 'price']
        })

        return res.json(registrations)
    }

    async store(req, res){

        const schema = Yup.object().shape({
            student_id: Yup.number().required(),
            plan_id: Yup.number().required(),
            start_date: Yup.date().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: 'Validation fails'})
        }

        /*** Check if student and plan exists */

        const studentExists = await Student.findOne({
            where:{
                id: req.body.student_id
            }
        })

        if(!studentExists){
            return res.status(400).json({error: 'Student does not exists'})
        }

        const plan = await Plan.findOne({
            where:{
                id: req.body.plan_id
            }
        })

        if(!plan){
            return res.status(400).json({error: 'Plan does not exists'})
        }

        /*** check if student already exist in the registration table*/

        const registrationExists = await Registration.findOne({
            where:{
                student_id: req.body.student_id
            }
        })

        if(registrationExists){
            return res.status(401).json({error: 'This registration already exists'})
        }

        /*** check if the date has passed*/

        const startDate = parseISO(req.body.start_date)

        if(isBefore(startDate, new Date())){
            return res.status(400).json({error: 'Past dates are nor permitted'})
        }

        /***  Calculating end date*/

        const endDate = addMonths(startDate, plan.duration) 
        
        /*** Calculating price*/
               
        const price = plan.price *  plan.duration

        const registration = await Registration.create({
            student_id: req.body.student_id,
            plan_id: req.body.plan_id,
            start_date: startDate,
            end_date: endDate,
            price: price
        })        

        return res.json(registration)
    }

    async update(req, res){
        const schema = Yup.object().shape({
            plan_id: Yup.number(),
            start_date: Yup.date()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: 'Validation fails'})
        }

        const registration = await Registration.findOne({
            where: {
                id: req.params.id,
            },
            attributes: ['id', 'student_id', 'plan_id', 'start_date', 'end_date', 'price'],

            include:[
                {
                    model: Plan,
                    as: 'plan',
                    attributes: ['id', 'title', 'duration', 'price']
                }
            ]
            
        })

        if(!registration){
            return res.status(400).json({error: 'Registration does not exists'})
        }

        if(req.body.plan_id && req.body.plan_id != registration.plan.id){
            const planExists = await Plan.findByPk(req.body.plan_id)

            if(!planExists){
                return res.status(400).json({error: 'Plan does not exists'})
            }
        }

        const startDate = req.body.start_date ? parseISO(req.body.start_date) : registration.start_date

        if(isBefore(startDate,  new Date())){
            return res.status(400).json({error: 'Past dates are nor permitted'})
        }

        const planId = req.body.plan_id ? req.body.plan_id : registration.plan.id

        const plan = await Plan.findOne({
            where:{
                id: planId
            },
            attributes: ['id', 'title', 'duration', 'price']
        })

        const endDate = addMonths(startDate, plan.duration)

        const price = plan.price * plan.duration

        await registration.update({
            plan_id: planId,
            start_date: startDate,
            end_date: endDate,
            price: price
        })

        await registration.save()

        return res.json(registration)
    }

    async delete(req, res){
        const registration = await Registration.findByPk(req.params.id)

        if(!registration){
            return res.status(400).json({error: "Registration does not exist"})
        }

        await registration.destroy()

        return res.json({ ok: 'Registration has been succefully deleted' })

    }
}

export default new RegistrationController()