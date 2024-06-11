import dayjs from 'dayjs'

import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen'
import { QuestionAttachmentList } from './question-attachment-list'
import { Slug } from './value-objects/slug'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID | null
  attachments: QuestionAttachmentList
  slug: Slug
  title: string
  content: string
  createdAt: Date
  updatedAt?: Date | null
}

type CreateQuestionPayload = Optional<
  QuestionProps,
  'createdAt' | 'slug' | 'attachments'
>

export class Question extends AggregateRoot<QuestionProps> {
  static create(props: CreateQuestionPayload, id?: UniqueEntityID) {
    const question = new Question(
      {
        slug: Slug.createFromText(props.title),
        createdAt: new Date(),
        attachments: new QuestionAttachmentList(),
        ...props,
      },
      id,
    )

    return question
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined | null) {
    if (
      !!bestAnswerId &&
      this.props.bestAnswerId &&
      !bestAnswerId.isEqualTo(this.props.bestAnswerId)
    ) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }

    this.props.bestAnswerId = bestAnswerId

    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)

    this.touch()
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content

    this.touch()
  }

  get excerpt() {
    return this.content.substring(0, 120).trim().concat('...')
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments

    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }
}
