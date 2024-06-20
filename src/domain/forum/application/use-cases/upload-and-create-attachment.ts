import { Either, left, right } from '@/core/either'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'

interface UploadAndCreateAttachmentUseCaseRequest {
  filename: string
  filetype: string
  body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment
  }
>

const validFileTypeRegex = /^(image\/(jpeg|png))$|^application\/pdf/

export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    body,
    filename,
    filetype,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!validFileTypeRegex.test(filetype)) {
      return left(new InvalidAttachmentTypeError(filetype))
    }

    const { url } = await this.uploader.upload({
      body,
      filename,
      filetype,
    })

    const attachment = Attachment.create({
      title: filename,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({
      attachment,
    })
  }
}
