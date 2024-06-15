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
import { DeleteAnswerService } from '../services/delete-answer.service'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/general/not-allowed-error'

@Controller('/answers/:answerId')
export class DeleteAnswerController {
  constructor(private readonly deleteAnswerService: DeleteAnswerService) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('answerId') answerId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    const result = await this.deleteAnswerService.execute({
      authorId: userId,
      answerId,
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
