import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { Room } from './room.model';

export type GuestDocument = Guest & Document;

@Schema()
@ObjectType()
export class Guest {
  /** ID of the Guest. */
  @Field(() => String, { description: 'ID of the Guest.' })
  id: string;

  /** Room the Guest is assigned to. */
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Room', required: true })
  @Field(() => Room, { description: 'Room the Guest is assigned to.' })
  room: string;

  /** Name of the Guest. */
  @Prop({ type: String, required: true })
  @Field(() => String, { description: 'Name of the Guest.' })
  name: string;

  /** Arrival date of the Guest to the Hotel in Unix Time. */
  @Prop({ type: Number, default: Math.floor(Date.now() / 1000) })
  @Field(() => Int, { description: 'Arrival date of the Guest to the Hotel in Unix Time.' })
  arrivalDate: number;
}

export const GuestSchema = SchemaFactory.createForClass(Guest);
