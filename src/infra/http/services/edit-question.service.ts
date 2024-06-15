import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EditQuestionService extends EditQuestionUseCase {
  constructor(
    questionRepository: QuestionsRepository,
    questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {
    super(questionRepository, questionAttachmentsRepository)
  }
}
