import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteAnswerService } from '../services/delete-answer.service'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deleteAnswerBodySchema = z.object({
  answerId: z.string(),
})

type DeleteAnswerBodySchema = z.infer<typeof deleteAnswerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(deleteAnswerBodySchema)

@Controller('/questions/:questionId/answers')
export class DeleteAnswerController {
  constructor(private readonly deleteAnswerService: DeleteAnswerService) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: DeleteAnswerBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { answerId } = body
    const userId = user.sub

    const result = await this.deleteAnswerService.execute({
      authorId: userId,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
