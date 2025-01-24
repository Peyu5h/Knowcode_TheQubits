export interface TransportData {
  type: 'bus' | 'flight' | 'train';
  from: string;
  to: string;
  distance_km: number;
  duration: string;
  price_inr: number;
  date: string;
  bus_name?: string;
  bus_number?: string;
  fuel?: string;
  airline?: string;
  flight_number?: string;
  train_name?: string;
  train_number?: string;
  eco?: boolean;
  eco_price?: number;
}

export interface HotelCardProps {
  hotel: {
    id: string;
    hotelName: string;
    rating: number;
    pricePerNight: number;
    images: string[];
    city: string;
    address: string;
    amenities: string[];
    ecofriendly_certificates: string[];
    eco: number;
    air_conditioned: boolean;
    co2emission: number;
  };
  isHighestEcoScore: boolean;
  onSelect: () => void;
  isSelected: boolean;
}
