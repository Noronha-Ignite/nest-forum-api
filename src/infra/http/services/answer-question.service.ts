import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AnswerQuestionService extends AnswerQuestionUseCase {
  constructor(answersRepository: AnswersRepository) {
    super(answersRepository)
  }
}
