import { Types } from 'mongoose';
import { Location as SharedLocation } from '@schoola/types/src';
import { BaseDocument } from './mongodb.base.types';

// MongoDB-compatible Location document type
export interface LocationDocument extends Omit<SharedLocation, 'id'>, BaseDocument {}

// Input types for creating/updating location documents
export type LocationCreateInput = Omit<LocationDocument, keyof BaseDocument>;
export type LocationUpdateInput = Partial<Omit<LocationDocument, keyof BaseDocument>> & { _id: Types.ObjectId };
