import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CreateHotelArgs, GetHotelArgs, GetHotelsArgs, RemoveHotelArgs, UpdateHotelArgs } from '../inputs';
import { Floor, Guest, Hotel } from '../models';
import { FloorService, GuestService, HotelService, RoomService } from '../services';

@Resolver(() => Hotel)
export class HotelResolver {
  constructor(
    private hotelService: HotelService,
    private floorService: FloorService,
    private roomService: RoomService,
    private guestService: GuestService,
  ) {}

  @Query(() => [Hotel])
  async hotels(@Args() {}: GetHotelsArgs) {
    return this.hotelService.find();
  }

  @Query(() => Hotel, { nullable: true })
  async hotel(@Args() { id }: GetHotelArgs) {
    return this.hotelService.findById(id);
  }

  @Mutation(() => Hotel, { nullable: true })
  async createHotel(@Args() { name, address, amenities, roomStyles, numFloors, numRooms }: CreateHotelArgs) {
    const hotel = await this.hotelService.create(name, address, amenities, roomStyles);
    if (numFloors) {
      const floors = await this.floorService.createMany(hotel.id, numFloors);
      if (numRooms)
        await Promise.all(floors.map((floor) => this.roomService.createMany(floor, numRooms, hotel.roomStyles)));
    }
    return hotel;
  }

  @Mutation(() => Hotel, { nullable: true })
  async updateHotel(@Args() { id, name, address, amenities, roomStyles }: UpdateHotelArgs) {
    return this.hotelService.update(id, { name, address, amenities, roomStyles });
  }

  @Mutation(() => String, { nullable: true })
  async removeHotel(@Args() { id }: RemoveHotelArgs) {
    const floors = await this.floorService.removeAll(id);
    const rooms = (await Promise.all(floors.flatMap((floor) => this.roomService.removeAll(floor)))).flat();
    await Promise.all(rooms.flatMap((room) => this.guestService.removeAll(room)));
    return this.hotelService.remove(id);
  }

  @ResolveField(() => [Floor])
  async floors(@Parent() hotel: Hotel) {
    return this.floorService.find({ hotelId: hotel.id });
  }

  @ResolveField(() => [Guest])
  async guests(@Parent() hotel: Hotel) {
    return this.hotelService.findGuests(hotel.id);
  }
}
