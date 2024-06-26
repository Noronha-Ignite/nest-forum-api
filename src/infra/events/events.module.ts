import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnQuestionBestAnswerChosenSubscription } from './subscriptions/on-question-best-answer-chosen.subscription'
import { OnAnswerCreatedSubscription } from './subscriptions/on-answer-created.subscription'
import { SendNotificationService } from './services/send-notification.service'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnQuestionBestAnswerChosenSubscription,
    OnAnswerCreatedSubscription,
    SendNotificationService,
  ],
})
export class EventsModule {}
