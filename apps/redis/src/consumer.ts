import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { TASKQUEUE } from "apps/redis/src/constants";
import { Job, Queue } from "bull";

@Processor(TASKQUEUE)
export class Consumer{
    constructor(
    @InjectQueue(TASKQUEUE) private readonly taskQueue:Queue
    ){}

    private readonly logger = new Logger(Consumer.name)

    @Process({name:"test1"})
    async process(job:Job<unknown>,done:any){
        this.logger.log(`processing job - ${job.name} - ${job.data}`)
        setTimeout(() => {
            done(); // Mark the job as completed after 1 second
          }, 1000);
        // done()
    }
}