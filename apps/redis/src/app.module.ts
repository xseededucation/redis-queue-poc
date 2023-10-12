import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { TASKQUEUE,DLQ } from './constants';
import { CacheModule } from "@nestjs/cache-manager";
import { RedisClientOptions } from "redis";
import { redisStore } from "cache-manager-redis-yet";
// import { RedisQueue } from 'libs/common/src/cache/redisQueue';
import { Consumer } from './consumers/consumer';
import { Consumer2 } from './consumers/consumer2';
import { Consumer1 } from './consumers/consumer1';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      useFactory: async (cfg: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: cfg.get("REDIS_HOST"),
            port: parseInt(cfg.get("REDIS_PORT")!),
          },
        }),
      }),
      inject: [ConfigService],
    }),
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
    BullModule.registerQueue({
      name: TASKQUEUE,
    }),
    BullModule.registerQueue({
      name: DLQ,
    })
  ],
  controllers: [AppController],
  providers: [AppService,Consumer,Consumer1,Consumer2],
})
export class AppModule {}

