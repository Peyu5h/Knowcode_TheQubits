import React, { useEffect, useState } from 'react';

import { FaPlane, FaTrain, FaCar } from 'react-icons/fa';
import { MdCompareArrows } from 'react-icons/md';

interface Leg {
  type: string;
  from: string;
  to: string;
  distance_km: number;
  duration: string;
  price_inr: number;
  date: string;
  [key: string]: any;
}

interface ConnectivityOption {
  type: 'direct' | 'indirect';
  legs: Leg[] | { transport: Leg; connectingCity?: string }[];
  totalDistance: number;
  totalPrice: number;
  co2Emission: number;
}

const ConnectivityCard: React.FC = () => {
  const [connectivityOptions, setConnectivityOptions] = useState<ConnectivityOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <FaPlane className="text-primary" />;
      case 'train':
        return <FaTrain className="text-primary" />;
      case 'car':
        return <FaCar className="text-primary" />;
      default:
        return null;
    }
  };

  if (loading) return <div>Loading connectivity options...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mb-6 space-y-4">
      <h2 className="text-2xl font-bold">Connectivity Options</h2>
      {connectivityOptions.map((option, index) => (
        <div key={index} className="rounded-lg border p-4 shadow-md">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-lg font-semibold">
              {option.type === 'direct' ? 'Direct Route' : 'Indirect Route'}
            </span>
            <span className="text-sm text-gray-500">Total Distance: {option.totalDistance} km</span>
          </div>
          <div className="flex items-center space-x-2">
            {option.legs.map((leg, legIndex) => {
              const transport = 'transport' in leg ? leg.transport : leg;
              return (
                <React.Fragment key={legIndex}>
                  {legIndex > 0 && <MdCompareArrows className="text-gray-400" />}
                  <div className="flex items-center space-x-2">
                    {getTransportIcon(transport.type)}
                    <span>{transport.from}</span>
                    <span>→</span>
                    <span>{transport.to}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span>Total Price: ₹{option.totalPrice}</span>
            <span>CO2 Emission: {option.co2Emission.toFixed(2)} kg</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConnectivityCard;
