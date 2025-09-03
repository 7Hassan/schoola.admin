import { Types } from 'mongoose';
import Location from '../services/db/models/location.model';
import { LocationDocument } from '../types';
import { EntityStatus } from '@schoola/types/src';

/**
 * Data Access Object for Location operations
 * Handles all database interactions for location management
 */
export class LocationDAO {
  /**
   * Create a new location
   * @param locationData - Location creation data
   * @returns Promise<LocationDocument>
   */
  static async create(locationData: Partial<LocationDocument>): Promise<LocationDocument> {
    const location = new Location(locationData);
    return location.save();
  }

  /**
   * Find location by ID
   * @param locationId - Location ID
   * @param populate - Fields to populate
   * @returns Promise<LocationDocument | null>
   */
  static async findById(locationId: string | Types.ObjectId, populate?: string[]): Promise<LocationDocument | null> {
    let query = Location.findById(locationId);

    if (populate) {
      populate.forEach((field) => {
        query = query.populate(field);
      });
    }

    return query.exec();
  }

  /**
   * Find location by code
   * @param code - Location code
   * @returns Promise<LocationDocument | null>
   */
  static async findByCode(code: string): Promise<LocationDocument | null> {
    return Location.findOne({ code: code.toUpperCase() });
  }

  /**
   * Find locations with filters
   * @param filter - Query filter
   * @param options - Query options
   * @returns Promise<LocationDocument[]>
   */
  static async find(
    filter: Record<string, any> = {},
    options: {
      limit?: number;
      skip?: number;
      sort?: Record<string, 1 | -1>;
      populate?: string[];
    } = {},
  ): Promise<LocationDocument[]> {
    let query = Location.find(filter);

    if (options.sort) {
      query = query.sort(options.sort);
    }

    if (options.skip) {
      query = query.skip(options.skip);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.populate) {
      options.populate.forEach((field) => {
        query = query.populate(field);
      });
    }

    return query.exec();
  }

  /**
   * Update location by ID
   * @param locationId - Location ID
   * @param updateData - Update data
   * @returns Promise<LocationDocument | null>
   */
  static async updateById(
    locationId: string | Types.ObjectId,
    updateData: Partial<LocationDocument>,
  ): Promise<LocationDocument | null> {
    return Location.findByIdAndUpdate(
      locationId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).populate('createdBy');
  }

  /**
   * Delete location by ID (soft delete)
   * @param locationId - Location ID
   * @returns Promise<LocationDocument | null>
   */
  static async deleteById(locationId: string | Types.ObjectId): Promise<LocationDocument | null> {
    return Location.findByIdAndUpdate(locationId, { status: EntityStatus.Inactive, updatedAt: new Date() }, { new: true });
  }

  /**
   * Count locations with filter
   * @param filter - Query filter
   * @returns Promise<number>
   */
  static async count(filter: Record<string, any> = {}): Promise<number> {
    return Location.countDocuments(filter);
  }

  /**
   * Find active locations
   * @returns Promise<LocationDocument[]>
   */
  static async findActiveLocations(): Promise<LocationDocument[]> {
    return Location.find({
      status: EntityStatus.Active,
      isActive: true,
    })
      .populate('createdBy')
      .sort({ name: 1 });
  }

  /**
   * Find locations by city
   * @param city - City name
   * @param includeInactive - Include inactive locations
   * @returns Promise<LocationDocument[]>
   */
  static async findByCity(city: string, includeInactive: boolean = false): Promise<LocationDocument[]> {
    const filter: Record<string, any> = {
      city: { $regex: city, $options: 'i' },
    };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
      filter['isActive'] = true;
    }
    return Location.find(filter).populate('createdBy').sort({ name: 1 });
  }

  /**
   * Find locations by state
   * @param state - State name
   * @param includeInactive - Include inactive locations
   * @returns Promise<LocationDocument[]>
   */
  static async findByState(state: string, includeInactive: boolean = false): Promise<LocationDocument[]> {
    const filter: Record<string, any> = {
      state: { $regex: state, $options: 'i' },
    };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
      filter['isActive'] = true;
    }
    return Location.find(filter).populate('createdBy').sort({ name: 1 });
  }

  /**
   * Find locations by country
   * @param country - Country name
   * @param includeInactive - Include inactive locations
   * @returns Promise<LocationDocument[]>
   */
  static async findByCountry(country: string, includeInactive: boolean = false): Promise<LocationDocument[]> {
    const filter: Record<string, any> = {
      country: { $regex: country, $options: 'i' },
    };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
      filter['isActive'] = true;
    }
    return Location.find(filter).populate('createdBy').sort({ name: 1 });
  }

  /**
   * Find locations by capacity range
   * @param minCapacity - Minimum capacity
   * @param maxCapacity - Maximum capacity
   * @param includeInactive - Include inactive locations
   * @returns Promise<LocationDocument[]>
   */
  static async findByCapacityRange(
    minCapacity: number,
    maxCapacity: number,
    includeInactive: boolean = false,
  ): Promise<LocationDocument[]> {
    const filter: Record<string, any> = {
      capacity: { $gte: minCapacity, $lte: maxCapacity },
    };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
      filter['isActive'] = true;
    }
    return Location.find(filter).populate('createdBy').sort({ capacity: -1 });
  }

  /**
   * Find locations near coordinates (requires geospatial indexing)
   * @param longitude - Longitude
   * @param latitude - Latitude
   * @param maxDistance - Maximum distance in meters
   * @param includeInactive - Include inactive locations
   * @returns Promise<LocationDocument[]>
   */
  static async findNearLocation(
    longitude: number,
    latitude: number,
    maxDistance: number = 10000,
    includeInactive: boolean = false,
  ): Promise<LocationDocument[]> {
    const filter: Record<string, any> = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
    };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
      filter['isActive'] = true;
    }
    return Location.find(filter).populate('createdBy');
  }

  /**
   * Search locations by text
   * @param searchText - Text to search in name, address, and description
   * @param includeInactive - Include inactive locations
   * @returns Promise<LocationDocument[]>
   */
  static async searchByText(searchText: string, includeInactive: boolean = false): Promise<LocationDocument[]> {
    const filter: Record<string, any> = {
      $or: [
        { name: { $regex: searchText, $options: 'i' } },
        { code: { $regex: searchText, $options: 'i' } },
        { description: { $regex: searchText, $options: 'i' } },
        { address: { $regex: searchText, $options: 'i' } },
        { city: { $regex: searchText, $options: 'i' } },
        { state: { $regex: searchText, $options: 'i' } },
      ],
    };

    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
      filter['isActive'] = true;
    }

    return Location.find(filter).populate('createdBy').sort({ name: 1 });
  }

  /**
   * Check if location code exists (excluding current location)
   * @param code - Location code to check
   * @param excludeId - Location ID to exclude from check
   * @returns Promise<boolean>
   */
  static async codeExists(code: string, excludeId?: string | Types.ObjectId): Promise<boolean> {
    const filter: Record<string, any> = { code: code.toUpperCase() };
    if (excludeId) {
      filter['_id'] = { $ne: excludeId };
    }
    const count = await Location.countDocuments(filter);
    return count > 0;
  }

  /**
   * Get location statistics
   * @returns Promise<any[]>
   */
  static async getStatistics(): Promise<any[]> {
    return Location.aggregate([
      {
        $group: {
          _id: '$country',
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $and: [{ $eq: ['$status', EntityStatus.Active] }, { $eq: ['$isActive', true] }] }, 1, 0] },
          },
          totalCapacity: { $sum: '$capacity' },
          avgCapacity: { $avg: '$capacity' },
          cities: { $addToSet: '$city' },
          states: { $addToSet: '$state' },
        },
      },
      {
        $addFields: {
          cityCount: { $size: '$cities' },
          stateCount: { $size: '$states' },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);
  }

  /**
   * Get locations grouped by city
   * @param includeInactive - Include inactive locations
   * @returns Promise<any[]>
   */
  static async groupByCity(includeInactive: boolean = false): Promise<any[]> {
    const matchStage: Record<string, any> = {};
    if (!includeInactive) {
      matchStage['status'] = EntityStatus.Active;
      matchStage['isActive'] = true;
    }

    const pipeline: any[] = [];
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push(
      {
        $group: {
          _id: {
            city: '$city',
            state: '$state',
            country: '$country',
          },
          locations: {
            $push: {
              _id: '$_id',
              name: '$name',
              code: '$code',
              address: '$address',
              capacity: '$capacity',
            },
          },
          totalLocations: { $sum: 1 },
          totalCapacity: { $sum: '$capacity' },
        },
      },
      {
        $sort: { '_id.country': 1, '_id.state': 1, '_id.city': 1 },
      },
    );

    return Location.aggregate(pipeline);
  }

  /**
   * Bulk update locations
   * @param filter - Query filter
   * @param updateData - Update data
   * @returns Promise<any>
   */
  static async updateMany(filter: Record<string, any>, updateData: Partial<LocationDocument>): Promise<any> {
    return Location.updateMany(filter, { ...updateData, updatedAt: new Date() });
  }
}
