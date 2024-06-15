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
import { EditQuestionService } from '../services/edit-question.service'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/general/not-allowed-error'

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema)

@Controller('/questions/:questionId')
export class EditQuestionController {
  constructor(private readonly editQuestionService: EditQuestionService) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('questionId') questionId: string,
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body
    const userId = user.sub

    const result = await this.editQuestionService.execute({
      title,
      content,
      authorId: userId,
      attachmentIds: [],
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
