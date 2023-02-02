import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileService, FileType } from 'file/file.service';
import { isObjectIdOrHexString, Model, Types } from 'mongoose';
import { Track, TrackDocument } from 'track/shemas/track.schema';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album, AlbumDocument } from './shemas/album.shema';

@Injectable()
export class AlbumService {
  constructor(
    private fileService: FileService,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
  ) {}

  async getAll(count = 10, offset = 0): Promise<Album[]> {
    const albums = await this.albumModel
      .find()
      .skip(offset)
      .limit(count)
      .populate('tracks');
    return albums;
  }

  async create(dto: CreateAlbumDto, picture): Promise<Album> {
    const picturePath = await this.fileService.createFile(
      FileType.IMAGE,
      picture,
    );
    const album = await this.albumModel.create({
      ...dto,
      picture: picturePath,
    });

    return album;
  }

  async delete(id: Types.ObjectId): Promise<Types.ObjectId> {
    const album = await this.albumModel.findByIdAndDelete(id);
    return album._id;
  }

  async addTracks(
    id: Types.ObjectId,
    tracks: Types.ObjectId[],
  ): Promise<Album> {
    const album = await this.albumModel.findById(id);

    for (let i = 0; i < tracks.length; i++) {
      if (!isObjectIdOrHexString(tracks[i])) {
        continue;
      }

      const trackIndex = this.checkIsTrackExistsInAlbum(album, tracks[i]);
      if (trackIndex !== false) {
        continue;
      }

      const track = await this.trackModel.findById(tracks[i]);
      if (track) {
        album.tracks.push(track.id);
      }
    }

    await album.save();
    return album.populate('tracks');
  }

  async deleteTrack(
    albumId: Types.ObjectId,
    trackId: Types.ObjectId,
  ): Promise<Album> {
    const album = await this.albumModel.findById(albumId).populate('tracks');

    const trackIndex = this.checkIsTrackExistsInAlbum(album, trackId);
    if (trackIndex !== false) {
      album.tracks.splice(trackIndex, 1);
    }

    await album.save();
    return album;
  }

  private checkIsTrackExistsInAlbum(
    album: Album,
    trackId: Types.ObjectId,
  ): false | number {
    let trackIndex: false | number = false;
    for (let i = 0; i < album.tracks.length; i++) {
      if (album.tracks[i]._id.toString() === trackId.toString()) {
        trackIndex = i;
        break;
      }
    }

    return trackIndex;
  }
}
