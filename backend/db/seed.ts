import { Mongoose } from 'mongoose';
import { seedFloors } from './seed-floors';
import { seedGuests } from './seed-guests';
import { seedHotels } from './seed-hotels';
import { seedRooms } from './seed-rooms';

async function seed() {
  const client = new Mongoose();

  try {
    await client.connect('mongodb://localhost', {
      user: 'root',
      pass: 'password',
      dbName: 'hotel',
    });
    console.log('Connected to database');
    const hotels = await seedHotels(client);
    console.log(`Seeded ${hotels.length} Hotels.`);
    const floors = await seedFloors(client, hotels as any[]);
    console.log(`Seeded ${floors.length} Floors.`);
    const rooms = await seedRooms(client, hotels as any[], floors as any[]);
    console.log(`Seeded ${rooms.length} Rooms.`);
    const guests = await seedGuests(client, rooms as any[]);
    console.log(`Seeded ${guests.length} Guests.`);
    console.log('Database seeded!');
    await client.disconnect();
  } catch (err) {
    console.log(err);
  }
}

seed();
