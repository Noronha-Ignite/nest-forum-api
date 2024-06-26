import {
  BadRequestException,
  NotFoundException,
  Controller,
  Param,
  Patch,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { ReadNotificationService } from '../services/read-notification.service'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { NotAllowedError } from '@/core/errors/general/not-allowed-error'

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private readNotificationService: ReadNotificationService) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('notificationId') notificationId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const recipientId = user.sub

    const result = await this.readNotificationService.execute({
      recipientId,
      notificationId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
