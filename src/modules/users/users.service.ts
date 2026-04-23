import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@modules/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createUserDto: CreateUserDto) {
    return this.databaseService.createUser(createUserDto);
  }

  async findAll() {
    return this.databaseService.findAllUsers();
  }

  async findOne(id: string) {
    return this.databaseService.findUserById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.databaseService.updateUser(id, updateUserDto);
  }

  async remove(id: string) {
    return this.databaseService.deleteUser(id);
  }
}
