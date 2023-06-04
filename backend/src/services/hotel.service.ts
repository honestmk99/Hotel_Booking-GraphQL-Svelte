import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Address, GuestDocument, Hotel, HotelDocument } from '../models';
import { Amenity, Style } from '../enum';

@Injectable()
export class HotelService {
  constructor(@InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>) {}

  async find(ids?: string[]): Promise<HotelDocument[]> {
    return this.hotelModel.find({ ...(ids && { _id: { $in: ids } }) }).exec();
  }

  async findById(id: string): Promise<HotelDocument> {
    return this.hotelModel.findById(id).exec();
  }

  async findGuests(id: string): Promise<GuestDocument[]> {
    return this.hotelModel
      .aggregate()
      .match({ _id: new Types.ObjectId(id) })
      .lookup({ from: 'floors', localField: '_id', foreignField: 'hotel', as: 'floors' })
      .lookup({ from: 'rooms', localField: 'floors._id', foreignField: 'floor', as: 'rooms' })
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

  async create(
    name: string,
    address: Address,
    amenities: Amenity[] = [],
    roomStyles: Style[] = [],
  ): Promise<HotelDocument> {
    const createdHotel = new this.hotelModel({ name, address, amenities, roomStyles });
    return createdHotel.save();
  }

  async update(
    id: string,
    data: { name?: string; address?: Partial<Address>; amenities?: Amenity[]; roomStyles?: Style[] },
  ): Promise<HotelDocument> {
    return this.hotelModel.findOneAndUpdate(
      { _id: id },
      {
        ...(data.name && { name: data.name }),
        ...(data.address?.city && { 'address.city': data.address.city }),
        ...(data.address?.state && { 'address.state': data.address.state }),
        ...(data.amenities && { amenities: data.amenities }),
        ...(data.roomStyles && { roomStyles: data.roomStyles }),
      },
      { new: true },
    );
  }

  async remove(id: string): Promise<string> {
    return this.hotelModel.deleteOne({ _id: id }).then((res) => (res.deletedCount === 1 ? id : null));
  }
}
