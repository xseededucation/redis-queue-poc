import { Module } from '@nestjs/common';
import { SubscriberController } from './subscriber.controller';
import { SubscriberService } from './subscriber.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { TASKQUEUE } from 'apps/redis/src/constants';
import { Consumer } from '../../redis/src/consumers/consumer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SubscriberController],
  providers: [SubscriberService,Consumer],
})
export class SubscriberModule {}
