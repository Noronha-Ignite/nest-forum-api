import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import { Injectable } from '@nestjs/common'
import { SendNotificationService } from '../services/send-notification.service'

@Injectable()
export class OnAnswerCreatedSubscription extends OnAnswerCreated {
  constructor(
    questionsRepository: QuestionsRepository,
    sendNotificationService: SendNotificationService,
  ) {
    super(questionsRepository, sendNotificationService)
  }
}
