import { Types } from 'mongoose';

export class CreateCommentDto {
  readonly username: string;
  readonly comment: string;
  readonly trackId: Types.ObjectId;
}
