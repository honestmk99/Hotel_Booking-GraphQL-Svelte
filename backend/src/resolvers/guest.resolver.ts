import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Loader } from '../dataloader.decorator';
import { CreateGuestArgs, GetGuestArgs, RemoveGuestArgs, UpdateGuestArgs } from '../inputs';
import { RoomsLoader } from '../loaders';
import { Guest, Room } from '../models';
import { GuestService, RoomService } from '../services';

@Resolver(() => Guest)
export class GuestResolver {
  constructor(private guestService: GuestService, private roomService: RoomService) {}

  @Query(() => Guest, { nullable: true })
  async guest(@Args() { id }: GetGuestArgs) {
    return this.guestService.findById(id);
  }

  @Mutation(() => Guest, { nullable: true })
  async createGuest(@Args() { roomId, name }: CreateGuestArgs) {
    return this.guestService.create(roomId, name);
  }

  @Mutation(() => Guest, { nullable: true })
  async updateGuest(@Args() { id, roomId, name }: UpdateGuestArgs) {
    return this.guestService.update(id, roomId, { name });
  }

  @Mutation(() => String, { nullable: true })
  async removeGuest(@Args() { id, roomId }: RemoveGuestArgs) {
    return this.guestService.remove(id, roomId);
  }

  @ResolveField(() => Room)
  async room(@Parent() guest: Guest, @Loader('rooms') roomsLoader: RoomsLoader) {
    return roomsLoader.load({ id: guest.room });
  }
}
