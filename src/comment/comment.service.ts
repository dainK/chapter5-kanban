import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    return await this.commentRepository.save({ createCommentDto, user_id: userId });
  }

  async findAll() {
    return await this.commentRepository.find();
  }

  async findOne(id: number) {
    return await this.commentRepository.findOneBy({ id: id });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, userId: number) {
    const comment = await this.findOne(id);
    if (userId !== comment.user_id) throw new UnauthorizedException('작성자만 수정할 수 있습니다.');

    return await this.commentRepository.update({ id: id }, { comment: updateCommentDto.comment });
  }

  async remove(id: number, userId: number) {
    const comment = await this.findOne(id);
    if (userId !== comment.user_id) throw new UnauthorizedException('작성자만 수정할 수 있습니다.');

    return await this.commentRepository.delete(id);
  }
}
