import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { CommentOnAnswerService } from '../services/comment-on-answer.service'

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
})

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema)

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(
    private readonly commentOnAnswerService: CommentOnAnswerService,
  ) {}

  @Post()
  async handle(
    @Param('answerId') answerId: string,
    @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body
    const authorId = user.sub

    const result = await this.commentOnAnswerService.execute({
      authorId,
      answerId,
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
