import * as Yup from 'yup'

import HelpOrder from '../models/HelpOrder'
import Student from '../models/Student'

class HelpOrderController{

    async index(req, res){

        const helpOrders = await HelpOrder.findAll({
            where:{
                answer_at: null
            },
            attributes: ['id', 'student_id', 'question', 'answer', 'answer_at'],
            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes:['id', 'name', 'email']
                }
            ]
        })

        return res.json(helpOrders)
    }

    async show(req, res){

        const {id} = req.params

        const helpOrders = await HelpOrder.findAll({
            where:{
                student_id: id
            },
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'student_id', 'question', 'answer', 'answer_at'],
            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes:['id', 'name', 'email']
                }
            ]
        })

        return res.json(helpOrders)
    }

    async store(req, res){

        const schema = await Yup.object().shape({
            question: Yup.string().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: 'Validation fails'})
        }

        const {id} = req.params

        const {question} = req.body

        const studentExists = await Student.findByPk(id)

        if(!studentExists){
            return res.status(400).json({error: 'Student does not exists'})
        }

        const {student_id} = await HelpOrder.create({
            student_id: id,
            question: question
        })
        

        return res.json({student_id, question})
    }
}

export default new HelpOrderController()