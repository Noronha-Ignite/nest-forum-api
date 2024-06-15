import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export abstract class AnswerAttachmentsRepository {
  abstract findAllByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  abstract deleteManyByAnswerId(answerId: string): Promise<void>
}
