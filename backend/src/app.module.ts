import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';
import { createFloorsLoader, createGuestsLoader, createHotelsLoader, createRoomsLoader } from './loaders';
import { Floor, FloorSchema, Guest, GuestSchema, Hotel, HotelSchema, Room, RoomSchema } from './models';
import { FloorResolver, GuestResolver, HotelResolver, RoomResolver } from './resolvers';
import { FloorService, GuestService, HotelService, RoomService } from './services';

const services = [HotelService, FloorService, RoomService, GuestService];

const resolvers = [HotelResolver, FloorResolver, RoomResolver, GuestResolver];

@Global()
@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (
        hotelService: HotelService,
        floorService: FloorService,
        roomService: RoomService,
        guestService: GuestService,
      ) => ({
        autoSchemaFile: join(process.cwd(), 'schema.gql'),
        sortSchema: true,
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        context: ({ req }: { req: any }) => {
          const loaders = {
            hotelsLoader: createHotelsLoader(hotelService),
            floorsLoader: createFloorsLoader(floorService),
            roomsLoader: createRoomsLoader(roomService),
            guestsLoader: createGuestsLoader(guestService),
          };
          return { req, ...loaders };
        },
      }),
      inject: [HotelService, FloorService, RoomService, GuestService],
    }),
    MongooseModule.forRoot('mongodb://localhost', {
      user: 'root',
      pass: 'password',
      dbName: 'hotel',
    }),
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: Floor.name, schema: FloorSchema },
      { name: Room.name, schema: RoomSchema },
      { name: Guest.name, schema: GuestSchema },
    ]),
  ],
  controllers: [],
  providers: [...services, ...resolvers],
  exports: [...services],
})
export class AppModule {}
