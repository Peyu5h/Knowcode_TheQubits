export const dummyFlights = [
  {
    type: 'flight',
    from: 'Mumbai',
    to: 'Delhi',
    distance_km: 1150,
    duration: '2h 10m',
    price_inr: 5999,
    date: '2024-03-25',
    airline: 'IndiGo',
    flight_number: '6E-195',
    eco: true,
    eco_price: 500,
    airlineLogo:
      'https://static-assets-ct.flixcart.com/ct/assets/resources/images/logos/air-logos/svg_logos/6E.svg',
  },
  {
    type: 'flight',
    from: 'Bangalore',
    to: 'Kolkata',
    distance_km: 1560,
    duration: '2h 45m',
    price_inr: 7499,
    date: '2024-03-25',
    airline: 'Air India',
    flight_number: 'AI-505',
    eco: false,
    airlineLogo:
      'https://static-assets-ct.flixcart.com/ct/assets/resources/images/logos/air-logos/svg_logos/AI.svg',
  },
];

export const dummyTrains = [
  {
    type: 'train',
    from: 'Mumbai',
    to: 'Delhi',
    distance_km: 1384,
    duration: '19h 10m',
    price_inr: 1610,
    date: '2024-03-25',
    train_name: 'Rajdhani Express',
    train_number: '12951',
    eco: true,
    eco_price: 200,
    departureStation: 'Mumbai Central (MMCT)',
    arrivalStation: 'New Delhi (NDLS)',
  },
  {
    type: 'train',
    from: 'Chennai',
    to: 'Bangalore',
    distance_km: 350,
    duration: '6h 30m',
    price_inr: 750,
    date: '2024-03-25',
    train_name: 'Shatabdi Express',
    train_number: '12007',
    eco: true,
    eco_price: 150,
    departureStation: 'Chennai Central (MAS)',
    arrivalStation: 'Bangalore City (SBC)',
  },
];

export const dummyBuses = [
  {
    type: 'bus',
    from: 'Mumbai',
    to: 'Pune',
    distance_km: 150,
    duration: '4h 00m',
    price_inr: 800,
    date: '2024-03-25',
    bus_name: 'Purple Travels',
    bus_number: 'PT-123',
    fuel: 'electric',
    eco: true,
    eco_price: 100,
    busType: 'A/C Sleeper (2+1)',
  },
  {
    type: 'bus',
    from: 'Delhi',
    to: 'Agra',
    distance_km: 200,
    duration: '4h 30m',
    price_inr: 600,
    date: '2024-03-25',
    bus_name: 'Green Express',
    bus_number: 'GE-456',
    fuel: 'diesel',
    eco: false,
    busType: 'A/C Seater',
  },
];

export const dummyCars = [
  {
    type: 'car',
    from: 'Mumbai',
    to: 'Lonavala',
    distance_km: 83,
    duration: '2h 00m',
    price_inr: 2500,
    date: '2024-03-25',
    car_type: 'SUV',
    car_model: 'Toyota Fortuner',
    fuel: 'hybrid',
    eco: true,
    eco_price: 300,
  },
  {
    type: 'car',
    from: 'Bangalore',
    to: 'Mysore',
    distance_km: 150,
    duration: '3h 30m',
    price_inr: 3000,
    date: '2024-03-25',
    car_type: 'Sedan',
    car_model: 'Honda City',
    fuel: 'petrol',
    eco: false,
  },
];

export const calculateCO2 = (type: string, distance: number, isEco: boolean): number => {
  const emissionFactors = {
    flight: 0.255, // kg CO2 per km
    train: 0.041,
    bus: 0.082,
    car: 0.171,
  };

  const factor = emissionFactors[type as keyof typeof emissionFactors] || 0;
  const emission = distance * factor;
  return isEco ? emission * 0.8 : emission;
};

export const getAllTransportData = () => {
  const flights = dummyFlights.map((flight) => ({
    ...flight,
    co2: calculateCO2('flight', flight.distance_km, !!flight.eco).toFixed(2),
  }));

  const trains = dummyTrains.map((train) => ({
    ...train,
    co2: calculateCO2('train', train.distance_km, !!train.eco).toFixed(2),
  }));

  const buses = dummyBuses.map((bus) => ({
    ...bus,
    co2: calculateCO2('bus', bus.distance_km, !!bus.eco).toFixed(2),
  }));

  const cars = dummyCars.map((car) => ({
    ...car,
    co2: calculateCO2('car', car.distance_km, !!car.eco).toFixed(2),
  }));

  return { flights, trains, buses, cars };
};

export const hotelImages = [
  'https://res.cloudinary.com/dv349glug/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1729397242/1_xnkb31.webp',
  'https://res.cloudinary.com/dv349glug/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1729397242/2_qzj5qw.webp',
  'https://res.cloudinary.com/dv349glug/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1729397243/3_gkw7r7.webp',
  'https://res.cloudinary.com/dv349glug/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1729397242/4_wbdq9h.webp',
  'https://res.cloudinary.com/dv349glug/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1729397244/5_s1vfgc.webp',
  'https://res.cloudinary.com/dv349glug/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1729397242/6_a4i6f6.webp',
];

export const dummyHotels = [
  {
    id: 'h1',
    hotelName: 'Luxury Green Resort',
    rating: 9.2,
    pricePerNight: 8500,
    images: hotelImages,
    city: 'Delhi',
    address: '123 Green Avenue, New Delhi',
    amenities: [
      'Infinity Pool',
      'Spa Center',
      'Organic Restaurant',
      'Fitness Center',
      'Electric Car Charging',
    ],

    ecofriendly_certificates: ['LEED Platinum', 'Green Globe'],
    air_conditioned: true,
    co2emission: 0.5,
    eco: 0.95,
    coordinates: {
      latitude: 28.6139,
      longitude: 77.209,
    },
  },
  {
    id: 'h2',
    hotelName: 'Urban Eco Hotel',
    rating: 8.8,
    pricePerNight: 6500,
    images: hotelImages,
    city: 'Delhi',
    address: '456 City Center, New Delhi',
    amenities: ['Rooftop Garden', 'Yoga Studio', 'Vegan Café', 'Business Center', 'Solar Powered'],

    ecofriendly_certificates: ['LEED Gold'],
    air_conditioned: true,
    co2emission: 0.6,
    eco: 0.85,
    coordinates: {
      latitude: 28.6329,
      longitude: 77.219,
    },
  },
  {
    id: 'h3',
    hotelName: 'Sustainable Suites',
    rating: 9.0,
    pricePerNight: 7500,
    images: hotelImages,
    city: 'Delhi',
    address: '789 Green Park, New Delhi',
    amenities: [
      'Rainwater Harvesting',
      'Organic Garden',
      'Eco-friendly Spa',
      'Green Gym',
      'Recycling Program',
    ],

    ecofriendly_certificates: ['LEED Platinum', 'Green Key'],
    air_conditioned: true,
    co2emission: 0.55,
    eco: 0.92,
    coordinates: {
      latitude: 28.6429,
      longitude: 77.229,
    },
  },
];
