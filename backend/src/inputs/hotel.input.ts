import { ArgsType, Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Amenity, State, Style } from '../enum';

// Inputs

@InputType({ description: 'Address described with city and state.' })
export class AddressInput {
  /** City component of the address. */
  @Field(() => String, { description: 'City component of the address.' })
  @IsString()
  @IsNotEmpty()
  city: string;

  /** State component of the address. */
  @Field(() => State, { description: 'State component of the address.' })
  @IsEnum(State)
  state: State;
}

@InputType({ description: 'Address described with city and state.' })
export class UpdateAddressInput {
  /** City component of the address. */
  @Field(() => String, { nullable: true, description: 'City component of the address.' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  /** State component of the address. */
  @Field(() => State, {
    nullable: true,
    description: 'State component of the address.',
  })
  @IsOptional()
  @IsEnum(State)
  state?: State;
}

// Args

@ArgsType()
export class GetHotelsArgs {}

@ArgsType()
export class GetHotelArgs {
  /** ID of the specific Hotel to retrieve. */
  @Field(() => ID, { description: 'ID of the specific Hotel to retrieve.' })
  @IsMongoId()
  id: string;
}

@ArgsType()
export class CreateHotelArgs {
  /** Name of the Hotel. */
  @Field(() => String, { description: 'Name of the Hotel.' })
  @IsString()
  @IsNotEmpty()
  name: string;

  /** Address of the Hotel. */
  @Field(() => AddressInput, { description: 'Address of the Hotel.' })
  @IsNotEmpty()
  address: AddressInput;

  /** Amenities of the Hotel. */
  @Field(() => [Amenity], { defaultValue: [], description: 'Amenities of the Hotel.' })
  @IsOptional()
  @IsEnum(Amenity, { each: true })
  amenities?: Amenity[];

  /** Available Room styles of the Hotel. */
  @Field(() => [Style], { defaultValue: [], description: 'Available Room styles of the Hotel.' })
  @IsOptional()
  @IsEnum(Style, { each: true })
  roomStyles?: Style[];

  /** Number of floors to autocreate in the Hotel. */
  @Field(() => Int, { nullable: true, description: 'Number of floors to autocreate in the Hotel.' })
  @IsOptional()
  @IsInt()
  numFloors?: number;

  /** Number of rooms per floor to autocreate in the Hotel. */
  @Field(() => Int, { nullable: true, description: 'Number of rooms per floor to autocreate in the Hotel.' })
  @IsOptional()
  @IsInt()
  numRooms?: number;
}

@ArgsType()
export class UpdateHotelArgs {
  /** ID of the specific Hotel to update. */
  @Field(() => ID, { description: 'ID of the specific Hotel to update.' })
  @IsMongoId()
  id: string;

  /** Name of the Hotel. */
  @Field(() => String, { nullable: true, description: 'Name of the Hotel.' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  /** Address of the Hotel. */
  @Field(() => UpdateAddressInput, { nullable: true, description: 'Address of the Hotel.' })
  @IsOptional()
  @IsNotEmpty()
  address?: UpdateAddressInput;

  /** Amenities of the Hotel. */
  @Field(() => [Amenity], { nullable: true, description: 'Amenities of the Hotel.' })
  @IsOptional()
  @IsEnum(Amenity, { each: true })
  amenities?: Amenity[];

  /** Available Room styles of the Hotel. */
  @Field(() => [Style], { nullable: true, description: 'Available Room styles of the Hotel.' })
  @IsOptional()
  @IsEnum(Style, { each: true })
  roomStyles?: Style[];
}

@ArgsType()
export class RemoveHotelArgs {
  /** ID of the specific Hotel to remove. */
  @Field(() => ID, { description: 'ID of the specific Hotel to remove.' })
  @IsMongoId()
  id: string;
}
