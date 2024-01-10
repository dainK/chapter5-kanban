import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Card } from 'src/card/entities/card.entity';
import { BoardMember } from 'src/board-member/entities/board-member.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Comment)
    private cardRepository: Repository<Card>,
    @InjectRepository(BoardMember)
    private boardMemberRepository: Repository<BoardMember>,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    await this.findCardById(createCommentDto.cardId); // 해당 카드 존재 여부 확인
    await this.findMemberById(userId); // 해당 사용자 보드 소속 여부 확인

    return await this.commentRepository.save({
      comment: createCommentDto.comment,
      card_id: createCommentDto.cardId,
      board_member_id: userId,
    });
  }

  // 해당 아이디를 가진 댓글 단일 조회 -> 수정, 삭제에 이용
  async findOne(id: number) {
    return await this.commentRepository.findOneBy({ id: id });
  }

  // 해당 카드에 소속된 댓글 전체 조회 -> 가능하면 추후 날짜 오름차순 정렬
  async findCommentByCardId(cardId: number) {
    return await this.commentRepository.findBy({ card_id: cardId });
  }

  // 해당 카드 존재 여부 확인 -> 없을 시 에러 출력
  async findCardById(cardId: number) {
    const card = await this.cardRepository.findBy({ id: cardId });
    if (!card) throw new NotFoundException('해당하는 카드가 존재하지 않습니다.');
  }

  // 해당 사용자 보드 소속 여부 확인 -> 없을 시 에러 출력
  async findMemberById(userId: number) {
    const member = await this.boardMemberRepository.findBy({ id: userId });
    if (!member) throw new UnauthorizedException('해당 보드의 멤버만 접근 가능합니다.');
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, userId: number) {
    const comment = await this.findOne(id);
    if (userId !== comment.board_member_id) throw new UnauthorizedException('작성자만 수정할 수 있습니다.');

    return await this.commentRepository.update({ id: id }, { comment: updateCommentDto.comment });
  }

  async remove(id: number, userId: number) {
    const comment = await this.findOne(id);
    if (userId !== comment.board_member_id) throw new UnauthorizedException('작성자만 수정할 수 있습니다.');

    return await this.commentRepository.delete(id);
  }
}
