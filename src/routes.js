import {Router} from 'express'

import SessionController from './app/controllers/SessionController'
import StudentController from './app/controllers/StudentController'
import PlanController from './app/controllers/PlanController'
import RegistrationController from './app/controllers/RegistrationController'
import CheckinController from './app/controllers/CheckinController'
import HelpOrderController from './app/controllers/HelpOrderController'
import AnswerController from './app/controllers/AnswerController'

import authMiddleware from './app/middlewares/auth'

const routes = new Router()

routes.post('/sessions', SessionController.store)

routes.post('/students/:id/checkins', CheckinController.store)
routes.get('/students/:id/checkins', CheckinController.show)

routes.post('/students/:id/help-orders', HelpOrderController.store)
routes.get('/students/:id/help-orders', HelpOrderController.show)

routes.use(authMiddleware)

routes.get('/students/help-orders', HelpOrderController.index)
routes.put('/students/:id/answer', AnswerController.update)

routes.post('/students', StudentController.store)
routes.put('/students/:id', StudentController.update)

routes.get('/plans', PlanController.index)
routes.post('/plans', PlanController.store)
routes.put('/plans/:id', PlanController.update)
routes.delete('/plans/:id', PlanController.delete)

routes.post('/registrations', RegistrationController.store)
routes.get('/registrations', RegistrationController.index)
routes.put('/registrations/:id', RegistrationController.update)
routes.delete('/registrations/:id', RegistrationController.delete)

export default routes