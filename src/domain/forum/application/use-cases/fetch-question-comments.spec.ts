import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

let inMemorySutRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch question comments use case', () => {
  beforeEach(() => {
    inMemorySutRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemorySutRepository)
  })

  it('should be able to fetch question comments', async () => {
    await inMemorySutRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
    )
    await inMemorySutRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
    )
    await inMemorySutRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('question-2') }),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.questionComments).toHaveLength(2)
  })

  it('should be able to paginated fetch question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemorySutRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.questionComments).toHaveLength(2)
  })
})
