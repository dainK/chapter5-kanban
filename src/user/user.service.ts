import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { BoardMember } from 'src/board-member/entities/board-member.entity';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(BoardMember)
    private boardMemberRepository: Repository<BoardMember>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async create(createDto: CreateUserDto) {
    const existingEmail = await this.findOneByEmail(createDto.email);
    if (existingEmail) {
      throw new ConflictException('이미 해당 이메일로 가입된 사용자가 있습니다!');
    }

    const existingName = await this.findOneByName(createDto.name);
    if (existingName) {
      throw new ConflictException('이미 해당 이름으로 가입된 사용자가 있습니다!');
    }

    if (createDto.password !== createDto.passwordConfirm) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const hashedPassword = await hash(createDto.password, 10);
    const user = await this.userRepository.save({
      email: createDto.email,
      password: hashedPassword,
      name: createDto.name,
    });
    return {
      id: user.id,
      email: user.email,
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
    const accessToken = this.jwtService.sign(payload, { expiresIn: '10m' });

    // refresh token 생성
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.redisService.setRefreshToken(String(user.id), refreshToken);

    return {
      access_token: accessToken,
    };
  }

  async findAll(boardId: number) {
    // 유저 목록 조회
    // const users = await this.userRepository.find();

    const users = await this.userRepository.createQueryBuilder('user').leftJoinAndSelect('user.boardMember', 'boardMember').where('boardMember.board_id IS NULL').select(['user.id', 'user.email', 'user.name']).getMany();
    return { users };
  }

  async searchAll(boardId: number, userKeyword: string) {
    const keywordPattern = `%${userKeyword}%`;
    // 칼럼 목록 조회
    const users = await this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.boardMember', 'boardMember')
    .where('boardMember.board_id IS NULL')
    .andWhere(new Brackets(qb => {
      qb.where('user.name LIKE :keywordPattern', { keywordPattern: `%${userKeyword}%` })
        .orWhere('user.email LIKE :keywordPattern', { keywordPattern: `%${userKeyword}%` })
    }))
    .select(['user.id', 'user.email', 'user.name'])
    .getMany();

    return { users };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    return { user };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.update({ id }, { name: updateUserDto.name });
    return { user: { title: updateUserDto.name } };
  }

  async remove(id: number) {
    // 회원 정보 삭제
    await this.userRepository.delete({ id });
    return { message: '회원 정보 삭제가 완료되었습니다.' };
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOneByName(name: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { name } });
  }
}
