import { AnswerQuestionUseCase } from './answer-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let inMemorySutRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer question use case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemorySutRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    )
    sut = new AnswerQuestionUseCase(inMemorySutRepository)
  })

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      content: 'nova resposta',
      authorId: '1',
      questionId: '2',
      attachmentIds: ['attachment-1', 'attachment-2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemorySutRepository.items[0]).toEqual(result.value.answer)
    expect(
      inMemorySutRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemorySutRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-2'),
      }),
    ])
  })

  it('should persist attachments when creating a new answer', async () => {
    const result = await sut.execute({
      content: 'nova pergunta',
      authorId: 'author-id-teste',
      attachmentIds: ['attachment-1', 'attachment-2'],
      questionId: '2',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(2)
    expect(inMemoryAnswerAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('attachment-1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('attachment-2'),
        }),
      ]),
    )
  })
})
