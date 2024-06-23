import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemorySutRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch question comments use case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemorySutRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(inMemorySutRepository)
  })

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John doe' })

    inMemoryStudentsRepository.items.push(student)

    await inMemorySutRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
        authorId: student.id,
      }),
    )
    await inMemorySutRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
        authorId: student.id,
      }),
    )
    await inMemorySutRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-2'),
        authorId: student.id,
      }),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.comments).toHaveLength(2)
    expect(result.value.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ author: 'John doe' }),
        expect.objectContaining({ author: 'John doe' }),
      ]),
    )
  })

  it('should be able to paginated fetch question comments', async () => {
    const student = makeStudent({ name: 'John doe' })

    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemorySutRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.comments).toHaveLength(2)
  })
})
