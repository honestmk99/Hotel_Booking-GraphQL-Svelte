import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Floor } from './floor.model';
import { Guest } from './guest.model';
import { Amenity, State, Style } from '../enum';

registerEnumType(State, {
  name: 'State',
});

@Schema({ _id: false })
@ObjectType()
export class Address {
  @Prop({ type: String, required: true })
  @Field(() => String, { description: 'City component of the address.' })
  city: string;

  @Prop({ type: String, enum: State, required: true })
  @Field(() => State, { description: 'State component of the address.' })
  state: State;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

registerEnumType(Amenity, {
  name: 'Amenity',
});

registerEnumType(Style, {
  name: 'Style',
});

export type HotelDocument = Hotel & Document;

@Schema()
@ObjectType()
export class Hotel {
  /** The ID of the Hotel. */
  @Field(() => String, { description: 'The ID of the Hotel.' })
  id: string;

  /** The name of the Hotel. */
  @Prop({ type: String, required: true })
  @Field(() => String, { description: 'The name of the Hotel.' })
  name: string;

  /** The address of the Hotel. */
  @Prop({ type: AddressSchema, required: true })
  @Field(() => Address, { description: 'The address of the Hotel.' })
  address: Address;

  /** The amenities the Hotel provides. */
  @Prop({ type: [String], enum: Amenity, default: [] })
  @Field(() => [Amenity], { description: 'The amenities the Hotel provides.' })
  amenities: Amenity[];

  /** The room styles the Hotel provides. */
  @Prop({ type: [String], enum: Style, default: [] })
  @Field(() => [Style], { description: 'The room styles the Hotel provides.' })
  roomStyles: Style[];

  /** The floors of the Hotel. */
  @Field(() => [Floor], { nullable: true, description: 'The floors of the Hotel.' })
  floors: Floor[];

  /** The guests of the Hotel. */
  @Field(() => [Guest], { nullable: true, description: 'The guests of the Hotel.' })
  guests: Guest[];
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
