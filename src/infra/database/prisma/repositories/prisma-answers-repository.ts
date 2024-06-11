import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}

  async create(answer: Answer): Promise<void> {
    await this.prisma.answer.create({
      data: {
        content: answer.content,
        authorId: answer.authorId.toString(),
        questionId: answer.questionId.toString(),
      },
    })
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    })
  }

  async save(answer: Answer): Promise<void> {
    await this.prisma.answer.update({
      where: {
        id: answer.id.toString(),
      },
      data: {
        content: answer.content,
        authorId: answer.authorId.toString(),
        questionId: answer.questionId.toString(),
        updatedAt: answer.updatedAt,
      },
    })
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    })

    if (!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const TAKE_PER_PAGE = 20

    const answers = await this.prisma.answer.findMany({
      take: TAKE_PER_PAGE,
      skip: TAKE_PER_PAGE * (page - 1),
      where: {
        questionId,
      },
    })

    return answers.map((answer) => PrismaAnswerMapper.toDomain(answer))
  }
}
