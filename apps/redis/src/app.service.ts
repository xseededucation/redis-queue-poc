import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { TASKQUEUE,DLQ } from './constants';
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectQueue(TASKQUEUE) private readonly taskQueue:Queue,
    @InjectQueue(DLQ) private readonly dlqQueue: Queue,
  ){}

  async enqueue(message:string): Promise<string> {
    let list = ["a","b","c","d","e"]

    for(let i=1;i<=1000;i++){
      console.log(`adding job - ${i}`)
      try {

      // Named  jobs
      let res = await this.taskQueue.add(
        // "consumer",
        // "consumer1",
        "consumer2",
        i ,
        {
          attempts: 5, 
          backoff: {
            type: 'exponential',
            // type: 'fixed',
            delay: 3000,            // delay in milliseconds 
          },
          // timeout: 100           //this will throw error after the time 
        }
      );
      
      console.log(res.data)
      } catch (error) {
        console.log(i)
        console.log(error) 
      }
    }
    return `Task Enqueued!`;
  }
  
  async getQueue(){
    const jobs = await this.dlqQueue.getJobs(['waiting'])
    console.log(jobs) //process them with interval
    return {len:jobs.length,jobs}
  }

  async getCache(){
    let list = []
    for(let i=0;i<100000;i++){
      let item = await this.cacheManager.get(`${i}`)
      if(item){
        list.push(item)
      }
    }
    return list
  }

  async setCache(){
    for(let i=0;i<100000;i++){
      await this.cacheManager.set(`${i}`,i)
    }
    return "success"
  }
}
