import DataLoader from 'dataloader';
import { GuestDocument } from '../models';
import { GuestService } from '../services';

export type GuestsLoader = DataLoader<{ id: GuestDocument['id'] }, GuestDocument>;

export const createGuestsLoader = (guestService: GuestService) => {
  return new DataLoader<{ id: GuestDocument['id'] }, GuestDocument>(
    async (keys) => {
      const guests = await guestService.find({ ids: keys.map((key) => key.id) });

      const guestsMap = Object.assign({}, ...guests.map((guest) => ({ [guest.id]: guest })));

      return keys.map(({ id }) => guestsMap[id]);
    },
    { cacheKeyFn: (key) => key.id as any },
  );
};
