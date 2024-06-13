import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { RegisterStudentService } from '../services/register-student-service'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(
    private readonly registerStudentService: RegisterStudentService,
  ) {}

  @Post('/')
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const result = await this.registerStudentService.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      throw new Error()
    }

    return {
      id: result.value.student.id.toString(),
    }
  }
}
