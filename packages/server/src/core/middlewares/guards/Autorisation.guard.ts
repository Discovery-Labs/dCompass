import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';

// import { UserService } from '../../../entities/User/User.service';

@Injectable()
export class AutorisationGuard implements CanActivate {
  // constructor() {}  private readonly userService: UserService, // private readonly reflector: Reflector,

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUserId = request?.session?.userId;

    if (!currentUserId) {
      return false;
    }

    return true;

    // const user = await this.userService.findOneWhere({
    //   id: currentUserId,
    //   confirmed: true,
    // });

    // if (!user) {
    //   return false;
    // }

    // const roles = this.reflector.get<any[] | null>(
    //   'roles',
    //   context.getHandler(),
    // );

    // if (!roles) {
    //   return true;
    // }
    // return roles.some((role) => role.name === user.role.name);
  }
}
