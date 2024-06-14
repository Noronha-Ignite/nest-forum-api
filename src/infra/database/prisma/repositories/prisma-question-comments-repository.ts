import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment)

    await this.prisma.comment.create({
      data,
    })
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment)

    await this.prisma.comment.delete({
      where: {
        id: data.id,
      },
    })
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const result = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    })

    if (!result) {
      return null
    }

    return PrismaQuestionCommentMapper.toDomain(result)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const TAKE_PER_PAGE = 20

    const result = await this.prisma.comment.findMany({
      take: TAKE_PER_PAGE,
      skip: TAKE_PER_PAGE * (page - 1),
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        questionId,
      },
    })

    return result.map(PrismaQuestionCommentMapper.toDomain)
  }
}
