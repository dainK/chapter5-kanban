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

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    // 프론트에서 로컬스토리지에 저장한 액세스 토큰을 지워줘야 할 것으로 생각 - 이아영
    await this.redisService.removeRefreshToken(req.user.id); // 리프레시 토큰 삭제
    return { message: '로그아웃이 되었습니다' };
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    return await this.userService.findOne(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Get(':boardId')
  findAll(@Param('boardId') boardId: number) {
    return this.userService.findAll(boardId);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Get('list/:boardId/:userKeyword')
  searchAll(@Param('boardId') boardId: number, @Param('userKeyword') userKeyword: string) {
    return this.userService.searchAll(boardId, userKeyword);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Patch()
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Delete()
  async remove(@Req() req) {
    await this.userService.remove(req.user.id);
    await this.redisService.removeRefreshToken(req.user.id); // 리프레시 토큰 삭제
    return { message: '회원 탈퇴가 완료되었습니다' };
  }
}
