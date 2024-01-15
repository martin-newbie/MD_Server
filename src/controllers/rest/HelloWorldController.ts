import { HelloService } from './../../services/HelloService';
import {Controller, Inject} from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from '@tsed/platform-params';
import { Get, Post, Put } from "@tsed/schema";
import { HelloModel } from '../../models/HelloModel';

@Controller("/hello-world")
export class HelloWorldController {
  @Inject()
  protected helloService: HelloService;

  @Get("/")
  get() {
    return this.helloService.getHellos('ksmin');
  }

  @Get("/get/:id")
  getOne(@PathParams("id") id: number) {
    return this.helloService.getHello(id);
  }

  @Get("/gets/")
  getMany(
    @QueryParams("firstName") firstName: string
  ) {
    if(firstName==null) {
      return {"code": 400, "message": "firstName is required"};
    }
    
    return this.helloService.getHelloByName(firstName);
  } 

  @Post("/")
  create(@BodyParams() hello: HelloModel) {
    return this.helloService.create(hello);
  }

  @Put("/")
  update(@BodyParams() hello: HelloModel) {
    return this.helloService.update(hello);
  }
}