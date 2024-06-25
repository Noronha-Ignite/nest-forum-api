import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { Comment, User } from '@prisma/client'

type PrismaCommentWithAuthor = Comment & { author: User }

export class PrismaCommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      authorId: new UniqueEntityID(raw.authorId),
      commentId: new UniqueEntityID(raw.id),
      author: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
