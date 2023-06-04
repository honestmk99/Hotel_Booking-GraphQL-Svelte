import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Loader } from '../dataloader.decorator';
import { CreateRoomArgs, GetRoomArgs, RemoveRoomArgs, UpdateRoomArgs } from '../inputs';
import { FloorsLoader } from '../loaders';
import { Floor, Guest, Room } from '../models';
import { GuestService, RoomService } from '../services';

@Resolver(() => Room)
export class RoomResolver {
  constructor(private roomService: RoomService, private guestService: GuestService) {}

  @Query(() => Room, { nullable: true })
  async room(@Args() { id }: GetRoomArgs) {
    return this.roomService.findById(id);
  }

  @Mutation(() => Room, { nullable: true })
  async createRoom(@Args() { floorId, number, style }: CreateRoomArgs) {
    return this.roomService.create(floorId, number, style);
  }

  @Mutation(() => Room, { nullable: true })
  async updateRoom(@Args() { id, floorId, number, style }: UpdateRoomArgs) {
    return this.roomService.update(id, floorId, { number, style: style });
  }

  @Mutation(() => String, { nullable: true })
  async removeRoom(@Args() { id, floorId }: RemoveRoomArgs) {
    await this.guestService.removeAll(id);
    return this.roomService.remove(id, floorId);
  }

  @ResolveField(() => Floor)
  async floor(@Parent() room: Room, @Loader('floors') floorsLoader: FloorsLoader) {
    return floorsLoader.load({ id: room.floor });
  }

  @ResolveField(() => [Guest])
  async guests(@Parent() room: Room) {
    return this.guestService.find({ roomId: room.id });
  }
}
