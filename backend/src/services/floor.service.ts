import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Floor, FloorDocument, GuestDocument } from '../models';

@Injectable()
export class FloorService {
  constructor(@InjectModel(Floor.name) private floorModel: Model<FloorDocument>) {}

  async find(filter?: { hotelId?: string; ids?: string[] }): Promise<FloorDocument[]> {
    const { hotelId, ids } = filter;
    return this.floorModel.find({ ...(hotelId && { hotel: hotelId }), ...(ids && { _id: { $in: ids } }) }).exec();
  }

  async findById(id: string): Promise<FloorDocument> {
    return this.floorModel.findById(id).exec();
  }

  async findGuests(id: string): Promise<GuestDocument[]> {
    return this.floorModel
      .aggregate()
      .match({ _id: new Types.ObjectId(id) })
      .lookup({ from: 'rooms', localField: '_id', foreignField: 'floor', as: 'rooms' })
      .lookup({ from: 'guests', localField: 'rooms._id', foreignField: 'room', as: 'guests' })
      .unwind({ path: '$guests' })
      .replaceRoot('$guests')
      .exec()
      .then((guests: GuestDocument[]) =>
        guests.map((g) => {
          g.id = g._id;
          return g;
        }),
      );
  }

  async add(hotel: string): Promise<FloorDocument> {
    const [topFloor] = await this.floorModel.find({ hotel }).sort({ index: -1 }).limit(1);
    const addedFloor = new this.floorModel({ hotel, index: topFloor?.index + 1 || 1 });
    return addedFloor.save();
  }

  async createMany(hotel: string, count: number): Promise<FloorDocument[]> {
    const floors: any[] = [];
    for (let i = 0; i < count; i++) {
      const floor = new this.floorModel({ hotel, index: i + 1 });
      floors.push(floor);
    }
    return this.floorModel.insertMany(floors);
  }

  async update(id: string, hotel: string, data: { index?: number }): Promise<FloorDocument> {
    return this.floorModel.findOneAndUpdate(
      { _id: id, hotel },
      { ...(data.index && { index: data.index }) },
      { new: true },
    );
  }

  async remove(hotel: string): Promise<string> {
    const [topFloor] = await this.floorModel.find({ hotel }).sort({ index: -1 }).limit(1);
    if (!topFloor) return null;
    return this.floorModel
      .deleteOne({ _id: topFloor.id, hotel })
      .then((res) => (res.deletedCount === 1 ? topFloor.id : null));
  }

  async removeAll(hotel: string): Promise<string[]> {
    const floors = await this.floorModel.find({ hotel });
    if (floors.length === 0) return [];

    return this.floorModel
      .deleteMany({ _id: { $in: floors.map((floor) => floor.id) } })
      .then((res) => (res.deletedCount >= 1 ? floors.map((floor) => floor.id) : null));
  }
}
