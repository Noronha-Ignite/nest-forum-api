import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteQuestionService } from '../services/delete-question.service'

@Controller('/questions/:questionId')
export class DeleteQuestionController {
  constructor(private readonly deleteQuestionService: DeleteQuestionService) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('questionId') questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    const result = await this.deleteQuestionService.execute({
      authorId: userId,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
