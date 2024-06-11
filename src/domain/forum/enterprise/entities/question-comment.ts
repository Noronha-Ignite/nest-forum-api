import { Comment, CommentProps } from './comments'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityID
}

type CreateQuestionCommentPayload = Optional<QuestionCommentProps, 'createdAt'>

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(props: CreateQuestionCommentPayload, id?: UniqueEntityID) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return questionComment
  }
}
