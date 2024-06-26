import { makeAttachment } from 'test/factories/make-attachment'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemorySutRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionBySlugUseCase

describe('Get question by slug', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemorySutRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(inMemorySutRepository)
  })

  it('should be able to get a question by slug', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    await inMemoryStudentsRepository.create(student)

    const newQuestion = makeQuestion({
      slug: Slug.create('example-question'),
      authorId: student.id,
    })
    inMemorySutRepository.create(newQuestion)

    const attachment = makeAttachment({
      title: 'attachment-1',
    })

    await inMemoryAttachmentsRepository.create(attachment)

    await inMemoryQuestionAttachmentsRepository.createMany([
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    ])

    const result = await sut.execute({ slug: 'example-question' })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      question: expect.objectContaining({
        title: newQuestion.title,
        slug: Slug.create('example-question'),
        author: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: 'attachment-1',
          }),
        ],
      }),
    })
  })
})
