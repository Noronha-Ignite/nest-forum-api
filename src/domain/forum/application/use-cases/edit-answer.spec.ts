import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/general/not-allowed-error'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemorySutRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let sut: EditAnswerUseCase

describe('Edit answer use case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemorySutRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    )
    sut = new EditAnswerUseCase(
      inMemorySutRepository,
      inMemoryAnswerAttachmentRepository,
    )
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
        content: 'content-1',
      },
      new UniqueEntityID('id-test'),
    )

    inMemorySutRepository.create(newAnswer)
    expect(inMemorySutRepository.items[0]).toMatchObject({
      content: 'content-1',
    })

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

    await sut.execute({
      answerId: 'id-test',
      authorId: 'author-1',
      content: 'content-2',
      attachmentIds: ['1', '3'],
    })

    expect(inMemorySutRepository.items[0]).toMatchObject({
      content: 'content-2',
    })
    expect(inMemorySutRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('3'),
      }),
    ])
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
        content: 'content-1',
      },
      new UniqueEntityID('id-test'),
    )

    inMemorySutRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: 'id-test',
      authorId: 'author-2',
      content: 'content-2',
      attachmentIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
