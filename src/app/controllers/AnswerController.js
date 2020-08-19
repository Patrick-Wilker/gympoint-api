import * as Yup from 'yup'

import HelpOrder from '../models/HelpOrder'
import Student from '../models/Student'

import AnswerMail from '../jobs/AnswerMail'
import Queue from '../../lib/Queue'

class AnswerController{
    async update(req, res){

        const schema = Yup.object().shape({
            answer: Yup.string().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: 'Validation fails'})
        }

        const {id} = req.params

        const idIsValid = Yup.object().shape({
            id: Yup.number().required()
        })

        if(!(await idIsValid.isValid({id: id}))){
            return res.status(400).json({error: 'Validation fails'})
        }

        const {answer} = req.body

        const questionExists = await HelpOrder.findByPk(id, {
            include:[
                {
                    model: Student,
                    as: 'student',
                    attributes: ['name', 'email']
                }
            ]
        })

        if(!questionExists){
            return res.status(400).json({error: 'Question does not exists'})
        }

        const {student_id, question, answer_at} = await questionExists.update({
            answer: answer,
            answer_at: new Date()
        })

        await questionExists.save()

        await Queue.add(AnswerMail.key,{
            questionExists,
        })

        return res.json({id, student_id, question, answer , answer_at})
    }
}

export default new AnswerController()