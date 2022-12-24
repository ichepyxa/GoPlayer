import { Controller, Get } from '@nestjs/common';
import { TrackService } from './track.service';

@Controller('/tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}

  create() {
    return 1;
  }

  @Get()
  getAll() {
    return 1;
  }

  getOne() {
    return 1;
  }

  delete() {
    return 1;
  }
}
