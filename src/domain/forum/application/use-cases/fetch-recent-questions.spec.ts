import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let inMemorySutRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch recent questions use case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemorySutRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new FetchRecentQuestionsUseCase(inMemorySutRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await inMemorySutRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 18) }),
    )
    await inMemorySutRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 23) }),
    )
    await inMemorySutRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 20) }),
    )

    const result = await sut.execute({ page: 1 })

    expect(result.isRight()).toBe(true)
    expect(result.value.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to paginated fetch recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemorySutRepository.create(makeQuestion())
    }

    const result = await sut.execute({ page: 2 })

    expect(result.isRight()).toBe(true)
    expect(result.value.questions).toHaveLength(2)
  })
})
