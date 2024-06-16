import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Body,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteAnswerCommentService } from '../services/delete-answer-comment.service'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deleteAnswerCommentBodySchema = z.object({
  commentId: z.string(),
})

type DeleteAnswerCommentBodySchema = z.infer<
  typeof deleteAnswerCommentBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(deleteAnswerCommentBodySchema)

@Controller('/answers/:answerId/comments')
export class DeleteAnswerCommentController {
  constructor(
    private readonly deleteAnswerCommentService: DeleteAnswerCommentService,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: DeleteAnswerCommentBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { commentId } = body
    const authorId = user.sub

    const result = await this.deleteAnswerCommentService.execute({
      authorId,
      answerCommentId: commentId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
