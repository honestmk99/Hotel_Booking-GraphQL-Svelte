import DataLoader from 'dataloader';
import { RoomDocument } from '../models';
import { RoomService } from '../services';

export type RoomsLoader = DataLoader<{ id: RoomDocument['id'] }, RoomDocument>;

export const createRoomsLoader = (roomService: RoomService) => {
  return new DataLoader<{ id: RoomDocument['id'] }, RoomDocument>(
    async (keys) => {
      const rooms = await roomService.find({ ids: keys.map((key) => key.id) });

      const roomsMap = Object.assign({}, ...rooms.map((room) => ({ [room.id]: room })));

      return keys.map(({ id }) => roomsMap[id]);
    },
    { cacheKeyFn: (key) => key.id as any },
  );
};
