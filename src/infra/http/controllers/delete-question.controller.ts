import {
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UnauthorizedException,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteQuestionService } from '../services/delete-question.service'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/general/not-allowed-error'

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
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new ConflictException(error.message)
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
