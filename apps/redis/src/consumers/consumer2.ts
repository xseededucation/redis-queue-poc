import { InjectQueue, Process, Processor, OnQueueEvent } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { DLQ, TASKQUEUE } from 'apps/redis/src/constants';
import { Job, Queue } from 'bull';

@Processor(TASKQUEUE)
export class Consumer2 {
  constructor(
    @InjectQueue(TASKQUEUE) private readonly taskQueue: Queue,
    @InjectQueue(DLQ) private readonly dlqQueue: Queue,
  ) {}

  private readonly logger = new Logger(Consumer2.name);
  private flag = true;

  @Process({ name: 'consumer2' })
  async process(job: Job<unknown>) {
    try {
      this.logger.log(`processingg job - ${job.name} - ${job.data}`);
      if (this.flag) {
        this.flag = false;
        let res =  await this.dlqQueue.add("dlq",job.data);
        console.log(`added to dlq - ${res}`)
      }
      this.flag = true;
      return Promise.resolve();
    } catch (error) {
      await this.dlqQueue.add(job.data);
      return Promise.resolve();
    }
  }
  @OnQueueEvent('completed')
  onJobCompleted(job: Job<unknown>) {
    this.logger.log(`Job completed - ${job.name} - ${job.data}`);
  }

  // Event handler for failed jobs
  @OnQueueEvent('failed')
  onJobFailed(job: Job<unknown>, error: Error) {
    this.logger.error(`Job failed - ${job.name} - ${job.data} - ${error.message}`);
  }
}
