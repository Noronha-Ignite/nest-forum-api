import { expect } from 'vitest'
import { DeleteAnswerUseCase } from './delete-answer'
import { NotAllowedError } from '@/core/errors/general/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let inMemorySutRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete answer use case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemorySutRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    )
    sut = new DeleteAnswerUseCase(inMemorySutRepository)
  })

  it('should be able to delete a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('id-test'),
    )

    inMemorySutRepository.create(newAnswer)
    expect(inMemorySutRepository.items).toHaveLength(1)

    inMemoryAnswerAttachmentRepository.items.push(
      makeAnswerAttachment({
        answerId: new UniqueEntityID('id-test'),
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: new UniqueEntityID('id-test'),
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({ answerId: 'id-test', authorId: 'author-1' })

    expect(inMemorySutRepository.items).toHaveLength(0)
    expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('id-test'),
    )

    inMemorySutRepository.create(newAnswer)
    expect(inMemorySutRepository.items).toHaveLength(1)

    const result = await sut.execute({
      answerId: 'id-test',
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
