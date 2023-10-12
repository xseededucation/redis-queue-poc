import { InjectQueue, Process, Processor, OnQueueEvent } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { TASKQUEUE } from 'apps/redis/src/constants';
import { Job, Queue } from 'bull';

@Processor(TASKQUEUE)
export class Consumer {
  constructor(@InjectQueue(TASKQUEUE) private readonly taskQueue: Queue) {}

  private readonly logger = new Logger(Consumer.name);
  private flag = true;

  @Process({ name: 'consumer' , concurrency: 1 })
  async process(job: Job<unknown>, done: any) {
    try {
      this.logger.log(`processingg job - ${job.name} - ${job.data}`);
      // setTimeout(() => {
      //   done(); // Mark the job as completed after 1 second
      // }, 1000);

      done();
    } catch (error) {
      console.error(`Error processing job: ${error}`);
    }
  }

  // Event handler for completed jobs
  // @OnQueueEvent('completed')
  // onJobCompleted(job: Job<unknown>) {
  //   this.logger.log(`Job completed - ${job.name} - ${job.data}`);
  // }

  // // Event handler for failed jobs
  // @OnQueueEvent('failed')
  // onJobFailed(job: Job<unknown>, error: Error) {
  //   this.logger.error(`Job failedd - ${job.name} - ${job.data} - ${error.message}`);
  // }
}
