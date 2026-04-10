// Supabase client configuration
// Replace with your actual Supabase URL and anon key
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Property {
  id: string;
  title: string;
  price: number; // in XLM
  location: string;
  description: string;
  owner: string;
  image_url?: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  is_sold: boolean;
  contract_id?: string;
  created_at: string;
  updated_at: string;
}

export type NewProperty = Omit<Property, 'id' | 'created_at' | 'updated_at' | 'is_sold'>;

// Fetch all available properties
export const fetchProperties = async (): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Fetch properties owned by a specific wallet
export const fetchPropertiesByOwner = async (owner: string): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('owner', owner)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Create a new property listing
export const createProperty = async (property: NewProperty): Promise<Property> => {
  const { data, error } = await supabase
    .from('properties')
    .insert([{ ...property, is_sold: false }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Mark property as sold and update owner
export const updatePropertyOwner = async (
  propertyId: string,
  newOwner: string
): Promise<void> => {
  const { error } = await supabase
    .from('properties')
    .update({ owner: newOwner, is_sold: true, updated_at: new Date().toISOString() })
    .eq('id', propertyId);

  if (error) throw error;
};

// Get a single property by ID
export const fetchPropertyById = async (id: string): Promise<Property | null> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
};
