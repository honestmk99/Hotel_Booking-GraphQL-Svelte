import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FloorDocument, Room, RoomDocument } from '../models';
import { Style } from '../enum';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async find(filter?: { floorId?: string; ids?: string[] }): Promise<RoomDocument[]> {
    const { floorId, ids } = filter;
    return this.roomModel.find({ ...(floorId && { floor: floorId }), ...(ids && { _id: { $in: ids } }) }).exec();
  }

  async findById(id: string): Promise<RoomDocument> {
    return this.roomModel.findById(id).exec();
  }

  async create(floor: string, number: number, style: Style): Promise<RoomDocument> {
    const createdRoom = new this.roomModel({ floor, number, style });
    return createdRoom.save();
  }

  async createMany(floor: FloorDocument, count: number, styles: Style[]): Promise<RoomDocument[]> {
    const rooms: any[] = [];
    for (let i = 0; i < count; i++) {
      const room = new this.roomModel({
        floor: floor.id,
        number: floor.index * 100 + i,
        style: styles[Math.floor(Math.random() * styles.length)],
      });
      rooms.push(room);
    }
    return this.roomModel.insertMany(rooms);
  }

  async update(id: string, floor: string, data: { number?: number; style?: Style }): Promise<RoomDocument> {
    return this.roomModel.findOneAndUpdate(
      { _id: id, floor },
      {
        ...(data.number && { number: data.number }),
        ...(data.style && { style: data.style }),
      },
      { new: true },
    );
  }

  async remove(id: string, floor: string): Promise<string> {
    return this.roomModel.deleteOne({ _id: id, floor }).then((res) => (res.deletedCount === 1 ? id : null));
  }

  async removeAll(floor: string): Promise<string[]> {
    const rooms = await this.roomModel.find({ floor });
    if (rooms.length === 0) return [];

    return this.roomModel
      .deleteMany({ _id: { $in: rooms.map((room) => room.id) } })
      .then((res) => (res.deletedCount >= 1 ? rooms.map((room) => room.id) : null));
  }
}
