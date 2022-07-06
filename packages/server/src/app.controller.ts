import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("/420")
  async getHigh(): Promise<string> {
    return "High!";
  }
}
