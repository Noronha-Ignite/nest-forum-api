import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { CreateQuestionService } from './services/create-question.service'
import { FetchRecentQuestionsService } from './services/fetch-recent-questions.service'
import { AuthenticateStudentService } from './services/authenticate-student.service'
import { RegisterStudentService } from './services/register-student.service'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { GetQuestionBySlugService } from './services/get-question-by-slug.service'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'
import { EditQuestionService } from './services/edit-question.service'
import { EditQuestionController } from './controllers/edit-question.controller'
import { DeleteQuestionController } from './controllers/delete-question.controller'
import { DeleteQuestionService } from './services/delete-question.service'
import { AnswerQuestionService } from './services/answer-question.service'
import { AnswerQuestionController } from './controllers/answer-question.controller'
import { EditAnswerController } from './controllers/edit-answer.controller'
import { EditAnswerService } from './services/edit-answer.service'
import { DeleteAnswerController } from './controllers/delete-answer.controller'
import { DeleteAnswerService } from './services/delete-answer.service'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
  ],
  providers: [
    CreateQuestionService,
    FetchRecentQuestionsService,
    AuthenticateStudentService,
    RegisterStudentService,
    GetQuestionBySlugService,
    EditQuestionService,
    DeleteQuestionService,
    AnswerQuestionService,
    EditAnswerService,
    DeleteAnswerService,
  ],
})
export class HttpModule {}
