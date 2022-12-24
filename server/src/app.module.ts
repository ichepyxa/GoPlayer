import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackModule } from 'track/track.module';

@Module({
  imports: [MongooseModule.forRoot('/'), TrackModule],
})
export class AppModule {}
