import { Controller, Get, Param, Req } from '@nestjs/common';
import { Context } from '../utils/types';
// import { idxAliases } from '../constants/idx';

@Controller('ceramic')
export class CeramicController {
  @Get('/quest/validate-completion')
  async validateQuestCompletion(
    @Req() request: Context['req'],
    @Param() params: { did: string; quest: string },
  ): Promise<any> {
    const isValid = true;
    return { questComplete: isValid ? 1 : 2 };
  }
}
