import { Comment, CommentProps } from './comments'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID
}

type CreateAnswerCommentPayload = Optional<AnswerCommentProps, 'createdAt'>

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId
  }

  static create(props: CreateAnswerCommentPayload, id?: UniqueEntityID) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return answerComment
  }
}
