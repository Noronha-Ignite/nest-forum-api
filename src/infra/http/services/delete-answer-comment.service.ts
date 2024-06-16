import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DeleteAnswerCommentService extends DeleteAnswerCommentUseCase {
  constructor(answerCommentRepository: AnswerCommentsRepository) {
    super(answerCommentRepository)
  }
}
