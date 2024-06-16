import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ChooseQuestionBestAnswerService } from '../services/choose-best-answer.service'

@Controller('/answers/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerController {
  constructor(
    private readonly chooseQuestionBestAnswerService: ChooseQuestionBestAnswerService,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('answerId') answerId: string,
    @CurrentUser() user: UserPayload,
  ) {
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
