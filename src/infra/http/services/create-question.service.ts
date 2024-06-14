import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateQuestionService extends CreateQuestionUseCase {
  constructor(questionRepository: QuestionsRepository) {
    super(questionRepository)
  }
}
