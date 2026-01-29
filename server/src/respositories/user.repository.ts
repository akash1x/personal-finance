import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  public saveUser(user: User) {
    return this.repository.save(user);
  }

  public findUserByEmail(email: object) {
    return this.repository.findOneBy(email);
  }

  public findOneBy(where: object) {
    return this.repository.findOneBy(where);
  }

  public findUserByEmailWithPassword(email: string) {
    return this.repository
      .createQueryBuilder('User')
      .where('User.email = :email', { email })
      .addSelect('User.password')
      .getOne();
  }

  public save(user: User) {
    return this.repository.save(user);
  }
}
