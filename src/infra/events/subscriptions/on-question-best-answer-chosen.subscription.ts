import { Injectable } from '@nestjs/common'
import { SendNotificationService } from '../services/send-notification.service'
import { OnQuestionBestAnswerChosen } from '@/domain/notification/application/subscribers/on-question-best-answer-chosen'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

@Injectable()
export class OnQuestionBestAnswerChosenSubscription extends OnQuestionBestAnswerChosen {
  constructor(
    answersRepository: AnswersRepository,
    sendNotificationService: SendNotificationService,
  ) {
    super(answersRepository, sendNotificationService)
  }
}
