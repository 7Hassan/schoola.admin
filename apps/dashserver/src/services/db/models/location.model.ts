import mongoose from 'mongoose';
import { locationSchema } from '../schemas/location.schema';
import { LocationDocument } from '../../../types';

const LocationModel = mongoose.model<LocationDocument>('Location', locationSchema);

export default LocationModel;
