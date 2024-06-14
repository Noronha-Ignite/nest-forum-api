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

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
  ],
  providers: [
    CreateQuestionService,
    FetchRecentQuestionsService,
    AuthenticateStudentService,
    RegisterStudentService,
    GetQuestionBySlugService,
  ],
})
export class HttpModule {}
