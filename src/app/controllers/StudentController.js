import Student from '../models/Student'

class StudentController{
    async store(req, res){

        const studentExists = await Student.findOne({
            where:{
                email: req.body.email
            }
        })

        if(studentExists){
            return res.status(400).json({error: "Student already exists"})
        }

        const {name, email, age, weight, height} = await Student.create(req.body)

        return res.json({
            name, email, age, weight, height
        })
    }

    async update(req, res){

        const {id}  = req.params;

        const student = await Student.findByPk(id)

        const {name, email, age, weight, height} = req.body

        if(email != student.email){
            const emailExists = await Student.findOne({
                where:{
                    email: email
                }
            })

            if(emailExists){
                return res.status(401).json({error: 'E-mail already exists'})
            }
        }

        await student.update({name, email, age, weight, height})
        await student.save()

        return res.json(student)
    }
}

export default new StudentController()