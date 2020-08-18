import * as Yup from 'yup'

import Plan from '../models/Plan'

class PlanController{

    async index(req, res){

        const plans = await Plan.findAll({
            attributes: ['id', 'title', 'duration', 'price']
        })

        return res.json(plans)
    }

    async store(req, res){

        const schema = Yup.object().shape({
            title: Yup.string().required(),
            duration: Yup.number().required(),
            price: Yup.number().required(),
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: 'Validation fails'})
        }

        const plan = await Plan.findOne({
            where:{
                title: req.body.title
            }
        })

        if(plan){
            return res.status(401).json({error: 'The name of this plan already exists'})
        }

        const {title, duration, price} = await Plan.create(req.body)


        return res.json({title, duration, price})
    }

    async update(req, res){

        const schema = Yup.object().shape({
            title: Yup.string(),
            duration: Yup.number(),
            price: Yup.number(),
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: 'Validation fails'})
        }

        const plan = await Plan.findByPk(req.params.id)

        if(!plan){
            return res.status(400).json({error: "Plan does not exist"})
        }

        const {title, duration, price} = req.body

        if(title != plan.title){
            const planExists = await Plan.findOne({where: {title}})

            if(planExists){
                return res.status(401).json({error: 'The name of this plan already exists'})
            }
        }

        await plan.update({title, duration, price})
        await plan.save()

        return res.json({title, duration, price})
    }

    async delete(req, res){

        const plan = await Plan.findByPk(req.params.id)

        if(!plan){
            return res.status(400).json({error: "Plan does not exist"})
        }

        await plan.destroy()

        return res.json({ ok: 'Plan has been succefully deleted' })
    }
}

export default new PlanController()