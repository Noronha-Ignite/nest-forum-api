import { Question } from '../../enterprise/entities/question'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from '@/core/errors/general/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title?: string
  content?: string
  attachmentIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    questionId,
    authorId,
    title,
    content,
    attachmentIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findAllByQuestionId(questionId)

    const questionAttachmentsList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )

    const questionAttachments = attachmentIds.map((attachmentId) =>
      QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      }),
    )

    questionAttachmentsList.update(questionAttachments)

    question.attachments = questionAttachmentsList
    question.title = title ?? question.title
    question.content = content ?? question.content

    await this.questionRepository.save(question)

    return right({
      question,
    })
  }
}
