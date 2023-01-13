import { Controller, Get } from '@nestjs/common';
import { AlbumService } from './album.service';

@Controller('/albums')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  getAll() {
    return 1;
  }
}
