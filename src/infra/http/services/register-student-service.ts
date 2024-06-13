import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RegisterStudentService extends RegisterStudentUseCase {
  constructor(
    studentsRepository: StudentsRepository,
    hashComparer: HashGenerator,
  ) {
    super(studentsRepository, hashComparer)
  }
}
