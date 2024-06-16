import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteAnswerCommentService } from '../services/delete-answer-comment.service'

@Controller('/answers/comments/:commentId')
export class DeleteAnswerCommentController {
  constructor(
    private readonly deleteAnswerCommentService: DeleteAnswerCommentService,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('commentId') commentId: string,
    @CurrentUser() user: UserPayload,
  ) {
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
