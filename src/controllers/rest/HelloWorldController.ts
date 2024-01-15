import { HelloService } from './../../services/HelloService';
import {Controller, Inject} from "@tsed/di";
import { BodyParams } from '@tsed/platform-params';
import {Get, Post} from "@tsed/schema";
import { HelloModel } from '../../models/HelloModel';

@Controller("/hello-world")
export class HelloWorldController {
  @Inject()
  protected helloService: HelloService;

  @Get("/")
  get() {
    return this.helloService.getHellos('ksmin');
  }

  @Post("/")
  create(@BodyParams() hello: HelloModel) {
    return this.helloService.create(hello);
  }
}