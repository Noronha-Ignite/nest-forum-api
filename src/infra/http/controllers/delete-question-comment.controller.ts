import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteQuestionCommentService } from '../services/delete-question-comment.service'

@Controller('/comments/:commentId')
export class DeleteQuestionCommentController {
  constructor(
    private readonly deleteQuestionCommentService: DeleteQuestionCommentService,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('commentId') questionCommentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const authorId = user.sub

    const result = await this.deleteQuestionCommentService.execute({
      authorId,
      questionCommentId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
