import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GrowthModule } from './analysis/growth/growth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        console.log('NODE_ENV:', configService.get('NODE_ENV'));
        const isDevelopmentLocal =
          configService.get('NODE_ENV') === 'development';

        if (isDevelopmentLocal) {
          return {
            type: 'sqlite' as const,
            database: 'db.sqlite',
            autoLoadEntities: true,
            synchronize: true,
            dropSchema: false,
          };
        } else {
          return {
            type: 'mysql' as const,
            host: configService.get<string>('MYSQL_DB_HOST'),
            port: configService.get<number>('MYSQL_DB_PORT'),
            username: configService.get<string>('MYSQL_DB_USER'),
            password: configService.get<string>('MYSQL_DB_PASSWORD'),
            database: configService.get<string>('MYSQL_DB_DATABASE'),
            autoLoadEntities: true,
            synchronize: false, // 주의: 프로덕션 환경에서는 false로 설정하세요
          };
        }
      },
      inject: [ConfigService],
    }),
    GrowthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
