import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { Hotel } from './hotel.model';

export type FloorDocument = Floor & Document;

@Schema()
@ObjectType()
export class Floor {
  /** ID of the floor. */
  @Field(() => String, { description: 'ID of the floor.' })
  id: string;

  /** Hotel the floor is in. */
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Hotel', required: true })
  @Field(() => Hotel, { description: 'Hotel the floor is in.' })
  hotel: string;

  /** Index of the floor within the Hotel. */
  @Prop({ type: Number, required: true })
  @Field(() => Int, { description: 'Index of the floor within the Hotel.' })
  index: number;
}

export const FloorSchema = SchemaFactory.createForClass(Floor);
