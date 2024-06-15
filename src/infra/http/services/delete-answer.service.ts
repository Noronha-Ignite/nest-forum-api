import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DeleteAnswerService extends DeleteAnswerUseCase {
  constructor(answerRepository: AnswersRepository) {
    super(answerRepository)
  }
}
