import { Controller, Get, Param, Query } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchQuestionAnswersService } from '../services/fetch-question-answers.service'
import { AnswerPresenter } from '../presenters/answer-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(
    private fetchQuestionAnswersService: FetchQuestionAnswersService,
    private answerPresenter: AnswerPresenter,
  ) {}

  @Get()
  async handle(
    @Param('questionId') questionId: string,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchQuestionAnswersService.execute({
      page,
      questionId,
    })

    const answers = await Promise.all(
      result.value.answers.map((answer) => this.answerPresenter.toHTTP(answer)),
    )

    return { answers }
  }
}
