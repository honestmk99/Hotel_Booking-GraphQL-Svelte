import { ArgsType, Field, ID, Int } from '@nestjs/graphql';
import { IsInt, IsMongoId, IsOptional } from 'class-validator';

// Args

@ArgsType()
export class GetFloorArgs {
  /** ID of the Hotel to retrieve the floor of. */
  @Field(() => ID, { description: 'ID of the Hotel to retrieve the floor of.' })
  @IsMongoId()
  hotelId: string;

  /** ID of the specific Floor to retrieve. */
  @Field(() => ID, { description: 'ID of the specific Floor to retrieve.' })
  @IsMongoId()
  id: string;
}

@ArgsType()
export class CreateFloorArgs {
  /** ID of the Hotel. */
  @Field(() => ID, { description: 'ID of the Hotel.' })
  @IsMongoId()
  hotelId: string;

  /** Number of rooms to autocreate. */
  @Field(() => Int, { nullable: true, description: 'Number of rooms to autocreate.' })
  @IsOptional()
  @IsInt()
  numRooms?: number;
}

@ArgsType()
export class RemoveFloorArgs {
  /** ID of the Hotel. */
  @Field(() => ID, { description: 'ID of the Hotel.' })
  @IsMongoId()
  hotelId: string;
}
