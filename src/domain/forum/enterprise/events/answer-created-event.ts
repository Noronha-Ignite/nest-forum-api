import { Answer } from '../entities/answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date

  constructor(public answer: Answer) {
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.answer.id
  }
}
