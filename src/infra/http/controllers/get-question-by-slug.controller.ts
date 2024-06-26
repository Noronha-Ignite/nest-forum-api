import {
  BadRequestException,
  NotFoundException,
  Controller,
  Get,
  Param,
} from '@nestjs/common'
import { GetQuestionBySlugService } from '../services/get-question-by-slug.service'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { QuestionDetailsPresenter } from '../presenters/question-details-presenter'

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlugService: GetQuestionBySlugService) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlugService.execute({ slug })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { question: QuestionDetailsPresenter.toHTTP(result.value.question) }
  }
}
