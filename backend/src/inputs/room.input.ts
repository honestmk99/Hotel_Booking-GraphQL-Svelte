import { ArgsType, Field, ID, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsMongoId, IsOptional } from 'class-validator';
import { Style } from '../enum';

// Args

@ArgsType()
export class GetRoomArgs {
  /** ID of the Floor to retrieve the room of. */
  @Field(() => ID, { description: 'ID of the Floor to retrieve the room of.' })
  @IsMongoId()
  floorId: string;

  /** ID of the specific Room to retrieve. */
  @Field(() => ID, { description: 'ID of the specific Room to retrieve.' })
  @IsMongoId()
  id: string;
}

@ArgsType()
export class CreateRoomArgs {
  /** ID of the Floor. */
  @Field(() => ID, { description: 'ID of the Floor.' })
  @IsMongoId()
  floorId: string;

  /** The Room number. */
  @Field(() => Int, { description: 'The Room number.' })
  @IsInt()
  number: number;

  /** The Room style. */
  @Field(() => Style, { description: 'The Room style.' })
  @IsEnum(Style)
  style: Style;
}

@ArgsType()
export class UpdateRoomArgs {
  /** ID of the specific Room to update. */
  @Field(() => ID, { description: 'ID of the specific Room to update.' })
  @IsMongoId()
  id: string;

  /** ID of the Floor. */
  @Field(() => ID, { description: 'ID of the Floor.' })
  @IsMongoId()
  floorId: string;

  /** The Room number. */
  @Field(() => Int, { nullable: true, description: 'The Room number.' })
  @IsOptional()
  @IsInt()
  number?: number;

  /** The Room style. */
  @Field(() => Style, { description: 'The Room style.' })
  @IsOptional()
  @IsEnum(Style)
  style?: Style;
}

@ArgsType()
export class RemoveRoomArgs {
  /** ID of the specific Room to remove. */
  @Field(() => ID, { description: 'ID of the specific Room to remove.' })
  @IsMongoId()
  id: string;

  /** ID of the Floor. */
  @Field(() => ID, { description: 'ID of the Floor.' })
  @IsMongoId()
  floorId: string;
}
