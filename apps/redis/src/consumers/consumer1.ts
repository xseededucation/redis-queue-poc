import { InjectQueue, Process, Processor,OnQueueEvent } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { TASKQUEUE } from 'apps/redis/src/constants';
import { Job, Queue } from 'bull';

@Processor(TASKQUEUE)
export class Consumer1 {
  constructor(@InjectQueue(TASKQUEUE) private readonly taskQueue: Queue) {}

  private readonly logger = new Logger(Consumer1.name);
  private flag = true;

  @Process({ name: 'consumer1' , concurrency: 1})
  async process(job: Job<unknown>) {
      this.logger.log(`processingg job - ${job.name} - ${job.data}`);
      if(this.flag){
        this.flag= false
        return Promise.reject(new Error('some unexpected error'));
      }
      this.flag= true
      return Promise.resolve();
  }

  // Event handler for completed jobs
  // @OnQueueEvent('completed')
  // onJobCompleted(job: Job<unknown>) {
  //   this.logger.log(`Job completed - ${job.name} - ${job.data}`);
  // }

  // // Event handler for failed jobs
  // @OnQueueEvent('failed')
  // onJobFailed(job: Job<unknown>, error: Error) {
  //   this.logger.error(`Job failed - ${job.name} - ${job.data} - ${error.message}`);
  // }
}
