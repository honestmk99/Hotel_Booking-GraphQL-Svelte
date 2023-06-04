import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { Floor } from './floor.model';
import { Style } from '../enum';

export type RoomDocument = Room & Document;

@Schema()
@ObjectType()
export class Room {
  /** ID of the Room. */
  @Field(() => String, { description: 'ID of the Room.' })
  id: string;

  /** Floor the Room resides on. */
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Floor', required: true })
  @Field(() => Floor, { description: 'Floor the Room resides on.' })
  floor: string;

  /** The Room number. */
  @Prop({ type: Number, required: true })
  @Field(() => Int, { description: 'The Room number.' })
  number: number;

  /** The style of the Room. */
  @Prop({ type: String, enum: Style, required: true })
  @Field(() => Style, { description: 'The style of the Room.' })
  style: Style;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
