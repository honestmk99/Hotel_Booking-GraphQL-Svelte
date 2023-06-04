import { faker } from '@faker-js/faker';
import { Mongoose } from 'mongoose';
import { GuestSchema, RoomDocument } from '../src/models';

export const seedGuests = async (mongoose: Mongoose, rooms: RoomDocument[]) => {
  const Guest = mongoose.model('Guest', GuestSchema);
  await Guest.collection.drop();

  const guests = rooms
    .map((room) => {
      if (!faker.datatype.boolean()) return null;
      const guest = new Guest({
        room: room._id,
        name: faker.name.fullName(),
        arrivalDate: Math.floor(faker.date.recent(7).getTime() / 1000),
      });
      return guest;
    })
    .filter((room) => room);

  return Guest.insertMany(guests);
};
