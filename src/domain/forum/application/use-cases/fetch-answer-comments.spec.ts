import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

let inMemorySutRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch answer comments use case', () => {
  beforeEach(() => {
    inMemorySutRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemorySutRepository)
  })

  it('should be able to fetch answer comments', async () => {
    await inMemorySutRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
    )
    await inMemorySutRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
    )
    await inMemorySutRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answer-2') }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.answerComments).toHaveLength(2)
  })

  it('should be able to paginated fetch answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemorySutRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.answerComments).toHaveLength(2)
  })
})
