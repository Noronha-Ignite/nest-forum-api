import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper'

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment)

    await this.prisma.comment.create({
      data,
    })
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment)

    await this.prisma.comment.delete({
      where: {
        id: data.id,
      },
    })
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const result = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    })

    if (!result) {
      return null
    }

    return PrismaAnswerCommentMapper.toDomain(result)
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const TAKE_PER_PAGE = 20

    const result = await this.prisma.comment.findMany({
      take: TAKE_PER_PAGE,
      skip: TAKE_PER_PAGE * (page - 1),
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        answerId,
      },
    })

    return result.map(PrismaAnswerCommentMapper.toDomain)
  }
}
