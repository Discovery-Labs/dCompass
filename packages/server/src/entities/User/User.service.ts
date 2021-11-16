import { Injectable, Logger } from '@nestjs/common';
import { User } from './User.entity';

@Injectable()
export class UserService {
  /** DB READ QUERIES **/
  async findAll(): Promise<void> {
    Logger.log({ context: UserService.name }, 'findAll');
    // return this.userRepository.find({ withDeleted: paranoid });
  }
  async findByDID(DID: string): Promise<User> {
    Logger.log({ context: UserService.name }, 'findByDID');
    return {
      did: DID,
      ethAddresses: ['0xosjidjis54d5sd4ezz5d4z45d455d4z54d'],
    };
    // return this.userRepository.find({ withDeleted: paranoid });
  }
}
