import { Mongoose } from 'mongoose';
import { FloorSchema, HotelDocument } from '../src/models';

export const seedFloors = async (mongoose: Mongoose, hotels: HotelDocument[]) => {
  const Floor = mongoose.model('Floor', FloorSchema);
  await Floor.collection.drop();

  const floors = hotels.flatMap((hotel) => {
    const hotelFloors: any[] = [];
    for (let i = 0; i < 10; i++) {
      const floor = new Floor({
        hotel: hotel._id,
        index: i + 1,
      });
      hotelFloors.push(floor);
    }
    return hotelFloors;
  });

  return Floor.insertMany(floors);
};
