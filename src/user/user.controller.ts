import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  @Post('signup')
  async signup(@Body() createDto: CreateUserDto) {
    return await this.userService.create(createDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto.email, loginDto.password);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  async logout(@Req() req) {
    // 프론트에서 로컬스토리지에 저장한 액세스 토큰을 지워줘야 할 것으로 생각 - 이아영
    await this.redisService.removeRefreshToken(req.user.id); // 리프레시 토큰 삭제
    return { message: '로그아웃이 되었습니다' };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  async getProfile(@Req() req) {
    return await this.userService.findOneByEmail(req.user.email);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.remove(+id);
    // 프론트에서 로컬스토리지에 저장한 액세스 토큰을 지워줘야 할 것으로 생각 - 이아영
    await this.redisService.removeRefreshToken(id); // 리프레시 토큰 삭제
    return { message: '회원 탈퇴가 완료되었습니다' };
  }
}
