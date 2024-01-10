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

  async create(comment: string, cardId: number, userId: number) {
    await this.findCardById(cardId); // 해당 카드 존재 여부 확인
    await this.findMemberById(userId); // 해당 사용자 보드 소속 여부 확인

    return await this.commentRepository.save({
      comment: comment,
      card_id: cardId,
      board_member_id: userId,
    });
  }

  // 해당 아이디를 가진 댓글 단일 조회 -> 수정, 삭제에 이용
  async findOne(id: number) {
    return await this.commentRepository.findOne({ where: { id: id } });
  }

  // 해당 카드에 소속된 댓글 전체 조회 -> 가능하면 추후 날짜 오름차순 정렬
  async findCommentByCardId(cardId: number) {
    const comments = await this.commentRepository.find({ where: { card_id: cardId }, order: { created_at: 'ASC' } });

    return comments.map((comment) => {
      return {
        id: comment.id,
        board_member_id: comment.board_member_id,
        comment: comment.comment,
        time: comment.created_at,
      };
    });
  }

  // 해당 카드 존재 여부 확인 -> 없을 시 에러 출력
  async findCardById(cardId: number) {
    const card = await this.cardRepository.find({ where: { id: cardId } });
    if (!card) throw new NotFoundException('해당하는 카드가 존재하지 않습니다.');
  }

  // 해당 사용자 보드 소속 여부 확인 -> 없을 시 에러 출력
  async findMemberById(userId: number) {
    const member = await this.boardMemberRepository.find({ where: { id: userId } });
    if (!member) throw new UnauthorizedException('해당 보드의 멤버만 접근 가능합니다.');
  }

  async update(id: number, updatedComment: string, userId: number) {
    const comment = await this.findOne(id);
    if (!comment) throw new NotFoundException('해당하는 댓글이 존재하지 않습니다.');
    if (userId !== comment.board_member_id) throw new UnauthorizedException('작성자만 수정할 수 있습니다.');

    await this.commentRepository.update({ id: id }, { comment: updatedComment });
    return await this.findOne(id);
  }

  async remove(id: number, userId: number) {
    const comment = await this.findOne(id);
    if (!comment) throw new NotFoundException('해당하는 댓글이 존재하지 않습니다.');
    if (userId !== comment.board_member_id) throw new UnauthorizedException('작성자만 삭제할 수 있습니다.');

    await this.commentRepository.delete(id);
    return { message: '댓글 삭제가 완료되었습니다.' };
  }
}
