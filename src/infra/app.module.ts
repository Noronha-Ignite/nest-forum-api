import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    HttpModule,
  ],
})
export class AppModule {}
