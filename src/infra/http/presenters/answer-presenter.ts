import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AnswerPresenter {
  constructor(private prisma: PrismaService) {}

  async toHTTP(answer: Answer) {
    return {
      id: answer.id.toString(),
      author: await this.getAuthorData(answer.authorId),
      questionId: answer.questionId.toString(),
      content: answer.content,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }

  async getAuthorData(authorId: UniqueEntityID) {
    const result = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: authorId.toString(),
      },
    })

    const { email, name, id, role } = result

    return {
      id,
      email,
      name,
      role,
    }
  }
}
