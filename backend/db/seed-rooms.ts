import { Mongoose } from 'mongoose';
import { Style } from '../src/enum';
import { FloorDocument, HotelDocument, RoomSchema } from '../src/models';

const getRoomStyle = (styles: Style[]) => styles[Math.floor(Math.random() * styles.length)];

export const seedRooms = async (mongoose: Mongoose, hotels: HotelDocument[], floors: FloorDocument[]) => {
  const Room = mongoose.model('Room', RoomSchema);
  await Room.collection.drop();

  const rooms = floors.flatMap((floor) => {
    const hotel = hotels.find((h) => h._id.equals(floor.hotel));
    const floorRooms: any[] = [];
    for (let i = 0; i < 10; i++) {
      const room = new Room({
        floor: floor._id,
        number: floor.index * 100 + i,
        style: getRoomStyle(hotel.roomStyles),
      });
      floorRooms.push(room);
    }
    return floorRooms;
  });

  return Room.insertMany(rooms);
};
