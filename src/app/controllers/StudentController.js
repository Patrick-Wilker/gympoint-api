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
}

export default new StudentController()