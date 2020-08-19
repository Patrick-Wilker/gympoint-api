import Mail from '../../lib/Mail'

class AnswerMail{
    get key(){
        return 'AnswerMail'
    }

    async handle({data}){
        const {questionExists} = data

        await Mail.sendMail({
            to: `${questionExists.student.name} <${questionExists.student.email}> `,
            subject: 'Sua pergunta foi respondida',
            template: 'answer',
            context:{
                student: questionExists.student.name,
                question: questionExists.question,
                answer: questionExists.answer
            }
        })
    }
}

export default new AnswerMail()