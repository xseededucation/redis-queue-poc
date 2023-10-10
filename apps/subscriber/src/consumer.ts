import { Logger } from "@nestjs/common";
import { TASKQUEUE } from "apps/redis/src/constants";
import Bull, { Job } from "bull";

export class Consumer{
    private queue;
    constructor(){
        this.queue = new Bull(TASKQUEUE);
        this.queue.process(async (job) => {
            console.log(job.data);
          });
    }
    private readonly logger = new Logger(Consumer.name)
    
    // @Process()
    async process(job:Job<unknown>){
        this.logger.log(`hey  -- ${job}`)
        // console.log(this.queue.job)
    }
}