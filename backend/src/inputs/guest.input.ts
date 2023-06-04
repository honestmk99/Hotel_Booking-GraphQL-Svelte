import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

// Args

@ArgsType()
export class GetGuestArgs {
  /** ID of the Room to retrieve the guest of. */
  @Field(() => ID, { description: 'ID of the Room to retrieve the guest of.' })
  @IsMongoId()
  roomId: string;

  /** ID of the specific Guest to retrieve. */
  @Field(() => ID, { description: 'ID of the specific Guest to retrieve.' })
  @IsMongoId()
  id: string;
}

@ArgsType()
export class CreateGuestArgs {
  /** ID of the Room. */
  @Field(() => ID, { description: 'ID of the Room.' })
  @IsMongoId()
  roomId: string;

  /** The Guest's name. */
  @Field(() => String, { description: `The Guest's name.` })
  @IsString()
  name: string;
}

@ArgsType()
export class UpdateGuestArgs {
  /** ID of the specific Guest to update. */
  @Field(() => ID, { description: 'ID of the specific Guest to update.' })
  @IsMongoId()
  id: string;

  /** ID of the Room. */
  @Field(() => ID, { description: 'ID of the Room.' })
  @IsMongoId()
  roomId: string;

  /** The Guest's name. */
  @Field(() => String, { nullable: true, description: `The Guest's name.` })
  @IsOptional()
  @IsString()
  name?: string;
}

@ArgsType()
export class RemoveGuestArgs {
  /** ID of the specific Guest to remove. */
  @Field(() => ID, { description: 'ID of the specific Guest to remove.' })
  @IsMongoId()
  id: string;

  /** ID of the Room. */
  @Field(() => ID, { description: 'ID of the Room.' })
  @IsMongoId()
  roomId: string;
}
