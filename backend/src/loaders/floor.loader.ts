import DataLoader from 'dataloader';
import { FloorDocument } from '../models';
import { FloorService } from '../services';

export type FloorsLoader = DataLoader<{ id: FloorDocument['id'] }, FloorDocument>;

export const createFloorsLoader = (floorService: FloorService) => {
  return new DataLoader<{ id: FloorDocument['id'] }, FloorDocument>(
    async (keys) => {
      const floors = await floorService.find({ ids: keys.map((key) => key.id) });

      const floorsMap = Object.assign({}, ...floors.map((floor) => ({ [floor.id]: floor })));

      return keys.map(({ id }) => floorsMap[id]);
    },
    { cacheKeyFn: (key) => key.id as any },
  );
};
