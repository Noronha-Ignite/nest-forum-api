import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer) {
    this.items.push(answer)
    DomainEvents.dispatchEventsForAggregate(answer.id)

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )
  }

  async save(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex(
      (item) => !item.id.isEqualTo(answer.id),
    )

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    )

    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)

    this.items[answerIndex] = answer
  }

  async delete(answer: Answer): Promise<void> {
    this.items = this.items.filter((item) => !item.id.isEqualTo(answer.id))

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }

  async findById(id: string): Promise<Answer | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    return this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
  }
}
