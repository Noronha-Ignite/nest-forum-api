import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditAnswerService } from '../services/edit-answer.service'
import { NotAllowedError } from '@/core/errors/general/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema)

@Controller('/answers/:answerId')
export class EditAnswerController {
  constructor(private readonly editAnswerService: EditAnswerService) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('answerId') answerId: string,
    @Body(bodyValidationPipe) body: EditAnswerBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { content, attachments } = body
    const authorId = user.sub

    const result = await this.editAnswerService.execute({
      attachmentIds: attachments,
      content,
      authorId,
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
