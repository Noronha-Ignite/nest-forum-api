import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { ChooseQuestionBestAnswerService } from '../services/choose-best-answer.service'

const chooseQuestionBestAnswerBodySchema = z.object({
  answerId: z.string(),
})

type ChooseQuestionBestAnswerBodySchema = z.infer<
  typeof chooseQuestionBestAnswerBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(
  chooseQuestionBestAnswerBodySchema,
)

@Controller('/questions/:questionId/bestAnswer')
export class ChooseQuestionBestAnswerController {
  constructor(
    private readonly chooseQuestionBestAnswerService: ChooseQuestionBestAnswerService,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('questionId') questionId: string,
    @Body(bodyValidationPipe) body: ChooseQuestionBestAnswerBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { answerId } = body
    const authorId = user.sub

    const result = await this.chooseQuestionBestAnswerService.execute({
      answerId,
      authorId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
