import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    await this.prisma.attachment.updateMany(
      PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments),
    )
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    await this.prisma.attachment.deleteMany(
      PrismaAnswerAttachmentMapper.toPrismaDeleteMany(attachments),
    )
  }

  async findAllByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const result = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    })

    return result.map(PrismaAnswerAttachmentMapper.toDomain)
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    })
  }
}
