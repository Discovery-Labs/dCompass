// import { Controller, Get, Req } from '@nestjs/common';
// import { Context } from '../utils/types';
// import { schemaAliases } from '../constants/idx';
// @Controller('knowsis')
// export class KnowsisController {
//   @Get('/contributors')
//   async findAllContributors(@Req() request: Context['req']): Promise<any> {
//     const contributors = await request.ceramicClient.idx.get(
//       schemaAliases.CONTRIBUTORS_ALIAS,
//     );

//     return { contributors };
//   }
// }
