import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DeleteQuestionCommentService extends DeleteQuestionCommentUseCase {
  constructor(questionCommentRepository: QuestionCommentsRepository) {
    super(questionCommentRepository)
  }
}
