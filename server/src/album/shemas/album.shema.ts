import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Track } from 'track/shemas/track.schema';

export type AlbumDocument = HydratedDocument<Album>;

@Schema()
export class Album {
  @Prop()
  name: string;

  @Prop()
  author: string;

  @Prop()
  picture: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Track' }] })
  tracks: Track[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
