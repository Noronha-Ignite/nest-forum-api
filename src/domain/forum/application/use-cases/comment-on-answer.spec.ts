import { CommentOnAnswerUseCase } from './comment-on-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: CommentOnAnswerUseCase

describe('Comment on answer use case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    )
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment on a answer', async () => {
    const answer = makeAnswer({}, new UniqueEntityID('answer-1'))

    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'This is a comment on the answer',
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1)
    expect(inMemoryAnswerCommentsRepository.items[0].content).toBe(
      'This is a comment on the answer',
    )
  })
})
