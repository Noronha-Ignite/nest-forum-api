import { Question } from '../entities/question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date

  constructor(
    public question: Question,
    public bestAnswerId: UniqueEntityID,
  ) {
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.question.id
  }
}
