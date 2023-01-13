import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumModule } from 'album/album.module';
import { TrackModule } from 'track/track.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from 'file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: path.resolve(__dirname, 'static') }),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.smbyjzv.mongodb.net/?retryWrites=true&w=majority`,
    ),
    FileModule,
    TrackModule,
    AlbumModule,
  ],
})
export class AppModule {}
