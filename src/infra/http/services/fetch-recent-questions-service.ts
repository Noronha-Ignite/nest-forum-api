import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FetchRecentQuestionsService extends FetchRecentQuestionsUseCase {
  constructor(questionRepository: QuestionsRepository) {
    super(questionRepository)
  }
}
