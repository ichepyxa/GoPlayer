import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Types } from 'mongoose';

@Controller('/albums')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  getAll(@Query('count') count: number, @Query('offset') offset: number) {
    return this.albumService.getAll(count, offset);
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  create(@UploadedFiles() files, @Body() dto: CreateAlbumDto) {
    const { picture } = files;
    return this.albumService.create(dto, picture[0]);
  }

  @Post(':albumId/tracks')
  addTracks(
    @Param('albumId') id: Types.ObjectId,
    @Body('tracks') tracks: Types.ObjectId[],
  ) {
    return this.albumService.addTracks(id, tracks);
  }

  @Delete(':albumId/tracks/:trackId')
  deleteTrack(
    @Param('albumId') albumId: Types.ObjectId,
    @Param('trackId') trackId: Types.ObjectId,
  ) {
    return this.albumService.deleteTrack(albumId, trackId);
  }

  @Delete(':id')
  delete(@Param('id') id: Types.ObjectId) {
    return this.albumService.delete(id);
  }
}
