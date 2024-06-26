import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    this.items.push(question)

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question): Promise<void> {
    this.items = this.items.filter((item) => !item.id.isEqualTo(question.id))
    await this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async save(question: Question): Promise<void> {
    const questionIndex = this.items.findIndex(
      (item) => !item.id.isEqualTo(question.id),
    )

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)

    this.items[questionIndex] = question
  }

  async findBySlug(slug: string): Promise<Question | null> {
    return this.items.find((item) => item.slug.value === slug) ?? null
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = await this.findBySlug(slug)

    if (!question) {
      return null
    }

    const author = this.studentsRepository.items.find((item) =>
      question?.authorId.isEqualTo(item.id),
    )

    if (!author) {
      throw new Error(
        `Author with id "${question.authorId.toString()}" does not exist`,
      )
    }

    const questionAttachments =
      await this.questionAttachmentsRepository.findAllByQuestionId(
        question.id.toString(),
      )
    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((item) =>
        item.id.isEqualTo(questionAttachment.attachmentId),
      )

      if (!attachment) {
        throw new Error(
          `Attachment with id "${questionAttachment.attachmentId.toString()}" does not exist`,
        )
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: author.id,
      bestAnswerId: question.bestAnswerId,
      author: author.name,
      title: question.title,
      content: question.content,
      slug: question.slug,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }

  async findById(id: string): Promise<Question | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    return this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
  }
}
