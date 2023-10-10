import { InjectQueue } from "@nestjs/bull";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Injectable } from "@nestjs/common";
import { TASKQUEUE } from "apps/redis/src/constants";
import { Queue } from "bull";
import { Cache } from 'cache-manager';

@Injectable()
export class RedisQueue {
  constructor(
    @InjectQueue(TASKQUEUE) private readonly taskQueue:Queue
  ) {}

  async add(message:string){
    await this.taskQueue.add(message)
  }

}
