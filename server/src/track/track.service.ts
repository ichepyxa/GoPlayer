import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileService, FileType } from 'file/file.service';
import { Model, Types } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { Comment, CommentDocument } from './shemas/comment.schema';
import { Track, TrackDocument } from './shemas/track.schema';

@Injectable()
export class TrackService {
  constructor(
    private fileService: FileService,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(dto: CreateTrackDto, picture, audio): Promise<Track> {
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const track = await this.trackModel.create({
      ...dto,
      listens: 0,
      audio: audioPath,
      picture: picturePath,
    });
    return track;
  }

  async getAll(count = 10, offset = 0): Promise<Track[]> {
    const tracks = await this.trackModel.find().skip(offset).limit(count);
    return tracks;
  }

  async search(query): Promise<Track[]> {
    const tracks = await this.trackModel.find({
      name: { $regex: new RegExp(query, 'i') },
    });
    return tracks;
  }

  async getOne(id: Types.ObjectId): Promise<Track> {
    const track = await this.trackModel.findById(id).populate('comments');
    return track;
  }

  async delete(id: Types.ObjectId): Promise<Types.ObjectId> {
    const track = await this.trackModel.findByIdAndDelete(id);
    return track._id;
  }

  async addComment(dto: CreateCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(dto.trackId);
    const comment = await this.commentModel.create({ ...dto });

    track.comments.push(comment.id);
    await track.save();
    return comment;
  }

  async listen(id: Types.ObjectId): Promise<void> {
    const track = await this.trackModel.findById(id);
    track.listens += 1;
    track.save();
  }
}
