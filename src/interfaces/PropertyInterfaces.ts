import { Property } from '../entities';

export interface ListPropertyFilter {
    page?: number;
    pageSize?: number;
    bedrooms?: number;
    bathrooms?: number;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
}

export interface ListPropertyResult {
    total: number;
    data: Property[]
}

export interface CreatePropertyData {
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    type?: string;
}

export interface UpdatePropertyData {
    address?: string;
    price?: number;
    bedrooms?: number;
    bathrooms?: number;
    type?: string;
}