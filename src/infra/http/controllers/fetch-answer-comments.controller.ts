import { Controller, Get, Param, Query } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { AnswerCommentPresenter } from '../presenters/answer-comment-presenter'
import { FetchAnswerCommentsService } from '../services/fetch-answer-comments.service'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerCommentsService: FetchAnswerCommentsService) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.fetchAnswerCommentsService.execute({
      page,
      answerId,
    })

    const { answerComments } = result.value

    return {
      answerComments: answerComments.map(AnswerCommentPresenter.toHTTP),
    }
  }
}
