import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Loader } from '../dataloader.decorator';
import { CreateFloorArgs, GetFloorArgs, RemoveFloorArgs } from '../inputs';
import { HotelsLoader } from '../loaders';
import { Floor, Guest, Hotel, Room } from '../models';
import { FloorService, GuestService, RoomService } from '../services';

@Resolver(() => Floor)
export class FloorResolver {
  constructor(
    private floorService: FloorService,
    private roomService: RoomService,
    private guestService: GuestService,
  ) {}

  @Query(() => Floor, { nullable: true })
  async floor(@Args() { id }: GetFloorArgs) {
    return this.floorService.findById(id);
  }

  @Mutation(() => Floor, { nullable: true })
  async addFloor(@Args() { hotelId, numRooms }: CreateFloorArgs, @Loader('hotels') hotelsLoader: HotelsLoader) {
    const floor = await this.floorService.add(hotelId);
    const hotel = await hotelsLoader.load({ id: floor.hotel });
    if (numRooms) await this.roomService.createMany(floor, numRooms, hotel.roomStyles);
    return floor;
  }

  @Mutation(() => String, { nullable: true })
  async removeFloor(@Args() { hotelId }: RemoveFloorArgs) {
    const floorId = await this.floorService.remove(hotelId);
    const rooms = await this.roomService.removeAll(floorId);
    await Promise.all(rooms.flatMap((room) => this.guestService.removeAll(room)));
    return floorId;
  }

  @ResolveField(() => Hotel)
  async hotel(@Parent() floor: Floor, @Loader('hotels') hotelsLoader: HotelsLoader) {
    return hotelsLoader.load({ id: floor.hotel });
  }

  @ResolveField(() => [Room])
  async rooms(@Parent() floor: Floor) {
    return this.roomService.find({ floorId: floor.id });
  }

  @ResolveField(() => [Guest])
  async guests(@Parent() floor: Floor) {
    return this.floorService.findGuests(floor.id);
  }
}
