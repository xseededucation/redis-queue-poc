import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { RedisQueue } from 'libs/common/src/cache/redisQueue';
import { TASKQUEUE } from './constants';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue(TASKQUEUE) private readonly taskQueue:Queue
  ){}
   
  async enqueue(message:string): Promise<string> {
    for(let i=0;i<200;i++){
      
      // Push a job to Queue
      await this.taskQueue.add(i,{ attempts: 1  })  

      // Named  jobs
      await this.taskQueue.add("test1",i,{ attempts: 2  })  

    }
    return `Task Enqueued!`;
  }
  
  async getQueue(){
    return await this.taskQueue.getWorkers()
    console.log("hello")
  }
}
