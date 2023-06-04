import { faker } from '@faker-js/faker';
import { Mongoose } from 'mongoose';
import { Amenity, State, Style } from '../src/enum';
import { HotelSchema } from '../src/models';

const AMENITIES = Object.values(Amenity);

const getAmenities = () => {
  const numAmenities = Math.floor(Math.random() * AMENITIES.length);
  const amenities = [];
  while (amenities.length < numAmenities) {
    const r = AMENITIES[Math.floor(Math.random() * AMENITIES.length)];
    if (amenities.indexOf(r) === -1) amenities.push(r);
  }
  return amenities;
};

const STYLES = Object.values(Style);

const getRoomStyles = () => {
  const numRoomStyles = Math.floor(Math.random() * STYLES.length) || 1;
  const roomStyles = [];
  while (roomStyles.length < numRoomStyles) {
    const r = STYLES[Math.floor(Math.random() * STYLES.length)];
    if (roomStyles.indexOf(r) === -1) roomStyles.push(r);
  }
  return roomStyles;
};

const STATES = Object.values(State);

const getState = () => STATES[Math.floor(Math.random() * STYLES.length)];

export const seedHotels = async (mongoose: Mongoose) => {
  const Hotel = mongoose.model('Hotel', HotelSchema);
  await Hotel.collection.drop();

  const hotels: any[] = [];
  for (let i = 0; i < 10; i++) {
    const hotel = new Hotel({
      name: `${faker.name
        .lastName()
        .split('')
        .map((c, i) => (i === 0 ? c.toUpperCase() : c))
        .join('')} Hotel`,
      address: {
        city: faker.address.city(),
        state: getState(),
      },
      amenities: getAmenities(),
      roomStyles: getRoomStyles(),
    });
    hotels.push(hotel);
  }
  return Hotel.insertMany(hotels);
};
