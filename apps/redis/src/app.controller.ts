import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('\producer')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':message')
  async enqueue(@Param('message') message:string): Promise<string> {
    return await this.appService.enqueue(message);
  }

  @Post(':message')
  async getQueue(@Param('message') message:string){
    return await this.appService.getQueue();
  }
}
