import { Body, Controller, Param, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { AnswerQuestionService } from '../services/answer-question.service'

const answerQuestionBodySchema = z.object({
  content: z.string(),
})

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

@Controller('/question/:questionId/answer')
export class AnswerQuestionController {
  constructor(private readonly answerQuestionService: AnswerQuestionService) {}

  @Post()
  async handle(
    @Param('questionId') questionId: string,
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body
    const authorId = user.sub

    await this.answerQuestionService.execute({
      attachmentIds: [],
      content,
      authorId,
      questionId,
    })
  }
}
