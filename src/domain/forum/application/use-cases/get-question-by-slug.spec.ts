import { Slug } from '../../enterprise/entities/value-objects/slug'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let inMemorySutRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionBySlugUseCase

describe('Get question by slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemorySutRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(inMemorySutRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({ slug: Slug.create('example-question') })
    inMemorySutRepository.create(newQuestion)

    const result = await sut.execute({ slug: 'example-question' })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      question: expect.objectContaining({
        id: expect.any(UniqueEntityID),
      }),
    })
  })
})
