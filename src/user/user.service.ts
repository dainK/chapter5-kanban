import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async create(createDto: CreateUserDto) {
    const existingUser = await this.findOneByEmail(createDto.email);
    if (existingUser) {
      throw new ConflictException('이미 해당 이메일로 가입된 사용자가 있습니다!');
    }

    const hashedPassword = await hash(createDto.password, 10);
    const user = await this.userRepository.save({
      email: createDto.email,
      password: hashedPassword,
      role: createDto.role,
      name: createDto.name,
    });
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '10s' });

    // refresh token 생성
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.redisService.setRefreshToken(String(user.id), refreshToken);

    return {
      access_token: accessToken,
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
}
