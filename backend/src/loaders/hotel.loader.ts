import DataLoader from 'dataloader';
import { HotelDocument } from '../models';
import { HotelService } from '../services';

export type HotelsLoader = DataLoader<{ id: HotelDocument['id'] }, HotelDocument>;

export const createHotelsLoader = (hotelService: HotelService) => {
  return new DataLoader<{ id: HotelDocument['id'] }, HotelDocument>(
    async (keys) => {
      const hotels = await hotelService.find(keys.map((key) => key.id));

      const hotelsMap = Object.assign({}, ...hotels.map((hotel) => ({ [hotel.id]: hotel })));

      return keys.map(({ id }) => hotelsMap[id]);
    },
    { cacheKeyFn: (key) => key.id as any },
  );
};
