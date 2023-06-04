import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Guest, GuestDocument } from '../models';

@Injectable()
export class GuestService {
  constructor(@InjectModel(Guest.name) private guestModel: Model<GuestDocument>) {}

  async find(filter?: { roomId?: string; ids?: string[] }): Promise<GuestDocument[]> {
    const { roomId, ids } = filter;
    return this.guestModel.find({ ...(roomId && { room: roomId }), ...(ids && { _id: { $in: ids } }) }).exec();
  }

  async findById(id: string): Promise<GuestDocument> {
    return this.guestModel.findById(id).exec();
  }

  async create(room: string, name: string): Promise<GuestDocument> {
    const createdGuest = new this.guestModel({ room, name });
    return createdGuest.save();
  }

  async update(id: string, room: string, data: { name?: string }): Promise<GuestDocument> {
    return this.guestModel.findOneAndUpdate(
      { _id: id, room },
      { ...(data.name && { name: data.name }) },
      { new: true },
    );
  }

  async remove(id: string, room: string): Promise<string> {
    return this.guestModel.deleteOne({ _id: id, room }).then((res) => (res.deletedCount === 1 ? id : null));
  }

  async removeAll(room: string): Promise<string[]> {
    const guests = await this.guestModel.find({ room });
    if (guests.length === 0) return [];

    return this.guestModel
      .deleteMany({ _id: { $in: guests.map((guest) => guest.id) } })
      .then((res) => (res.deletedCount >= 1 ? guests.map((guest) => guest.id) : null));
  }
}
