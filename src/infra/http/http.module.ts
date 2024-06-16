import { Module, Provider } from '@nestjs/common'
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
import { FetchQuestionAnswersController } from './controllers/fetch-question-answers.controller'
import { FetchQuestionAnswersService } from './services/fetch-question-answers.service'
import { AnswerPresenter } from './presenters/answer-presenter'
import { ChooseQuestionBestAnswerService } from './services/choose-best-answer.service'
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer.controller'
import { CommentOnQuestionService } from './services/comment-on-question.service'
import { CommentOnQuestionController } from './controllers/comment-on-question.controller'
import { DeleteQuestionCommentController } from './controllers/delete-question-comment.controller'
import { DeleteQuestionCommentService } from './services/delete-question-comment.service'
import { CommentOnAnswerController } from './controllers/comment-on-answer.controller'
import { CommentOnAnswerService } from './services/comment-on-answer.service'

const controllers = [
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
  FetchQuestionAnswersController,
  ChooseQuestionBestAnswerController,
  CommentOnQuestionController,
  CommentOnAnswerController,
  DeleteQuestionCommentController,
]

const services: Provider[] = [
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
  FetchQuestionAnswersService,
  ChooseQuestionBestAnswerService,
  CommentOnQuestionService,
  CommentOnAnswerService,
  DeleteQuestionCommentService,
]

const presenters: Provider[] = [AnswerPresenter]

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [...controllers],
  providers: [...services, ...presenters],
})
export class HttpModule {}
