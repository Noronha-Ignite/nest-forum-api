import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteQuestionCommentService } from '../services/delete-question-comment.service'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deleteQuestionCommentBodySchema = z.object({
  commentId: z.string(),
})

type DeleteQuestionCommentBodySchema = z.infer<
  typeof deleteQuestionCommentBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(
  deleteQuestionCommentBodySchema,
)

@Controller('/questions/:questionId/comments')
export class DeleteQuestionCommentController {
  constructor(
    private readonly deleteQuestionCommentService: DeleteQuestionCommentService,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: DeleteQuestionCommentBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { commentId } = body
    const authorId = user.sub

    const result = await this.deleteQuestionCommentService.execute({
      authorId,
      questionCommentId: commentId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
