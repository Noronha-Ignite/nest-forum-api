import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemorySutRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch answer comments use case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemorySutRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemorySutRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'John doe' })

    inMemoryStudentsRepository.items.push(student)

    await inMemorySutRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
        authorId: student.id,
      }),
    )
    await inMemorySutRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
        authorId: student.id,
      }),
    )
    await inMemorySutRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-2'),
        authorId: student.id,
      }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
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

  it('should be able to paginated fetch answer comments', async () => {
    const student = makeStudent({ name: 'John doe' })

    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemorySutRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.comments).toHaveLength(2)
  })
})
