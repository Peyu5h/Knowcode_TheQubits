import React, { useState } from 'react';
import { FaLeaf, FaMinus, FaPlus } from 'react-icons/fa';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "~/components/ui/carousel";
import { Check } from 'lucide-react-native';
import { Image } from 'react-native';

const hotelImage = [
  'https://res.cloudinary.com/dv349glug/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1729397242/1_xnkb31.webp',
  'https://res.cloudinary.com/dv349glug/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1729397242/2_qzj5qw.webp',
  'https://res.cloudinary.com/dv349glug/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1729397243/3_gkw7r7.webp',
  'https://res.cloudinary.com/dv349glug/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1729397242/4_wbdq9h.webp',
  'https://res.cloudinary.com/dv349glug/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1729397244/5_s1vfgc.webp',
  'https://res.cloudinary.com/dv349glug/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1729397242/6_a4i6f6.webp',
];

interface HotelCardProps {
  hotel: {
    _id: string;
    hotel_name: string;
    price_per_night: number;
    ecofriendly_certificates: string[];
    city: string;
    address: string;
    amenities: string[];
    reviews: string[];
    eco: number;
    image_index: number;
    air_conditioned: boolean;
    co2emission: number;
  };
  isHighestEcoScore: boolean;
  onSelect: () => void;
  isSelected: boolean;
}

const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  isHighestEcoScore,
  onSelect,
  isSelected,
}) => {
  const addToTotalBudget = () => {
    onSelect();
    // setTotalBudget(
    //   (prev) => prev + hotel.price_per_night * nights * totalPassenger,
    // );
    // setTotalCarbonEmission(
    //   (prev) => prev + hotel.co2emission * nights * totalPassenger,
    // );
  };

  // const incrementNights = () => setNights((prev) => prev + 1);
  // const decrementNights = () => setNights((prev) => Math.max(1, prev - 1));

  return (
    <div
      className={`relative rounded-lg bg-card shadow-md ${isSelected ? 'ring-2 ring-primary' : ''}`}
    >
      {isHighestEcoScore && (
        <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-md bg-secondary p-2 text-primary">
          <FaLeaf size={24} />
        </div>
      )}

      <Image
        src={hotelImage[hotel.image_index % hotelImage.length]}
        alt={hotel.hotel_name}
        className="mb-4 h-48 w-full rounded-t-lg object-cover"
        width={300}
        height={300}
      />

      <div className="p-4">
        <h2 className="text-xl font-bold">{hotel.hotel_name}</h2>
        <div className="mb-2 flex items-center justify-between">
          <p className="mb-2 text-gray-600">{hotel.city}</p>
          <div className="text-right">
            <p className="text-lg font-semibold">₹{hotel.price_per_night}/night</p>
            <p className="text-sm text-green-600">Eco Score: {Math.round(hotel.eco * 100)}%</p>
          </div>
        </div>
        <div className="mb-2 flex flex-wrap gap-2">
          {hotel.ecofriendly_certificates.map((cert, index) => (
            <span key={index} className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
              {cert}
            </span>
          ))}
        </div>
        <ul className="mb-2 text-sm text-gray-600">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <li className="flex items-center gap-2" key={index}>
              <Check className="h-4 w-4" />
              {amenity}
            </li>
          ))}
        </ul>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="mt-2 w-full"
              // onClick={onSelect}
            >
              See details
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{hotel.hotel_name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* <Carousel className="w-full max-w-xs">
                <CarouselContent>
                  {[0, 1, 2].map((index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={
                          hotelImage[
                            (hotel.image_index + index) % hotelImage.length
                          ]
                        }
                        alt={`${hotel.hotel_name} - Image ${index + 1}`}
                        className="h-48 w-full rounded-lg object-cover"
                        width={300}
                        height={300}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel> */}
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-500">{hotel.city}</p>
                <p className="text-sm text-gray-200">{hotel.address}</p>
              </div>
              <p className="font-semibold">₹{hotel.price_per_night}/night</p>
              <div className="flex flex-wrap gap-2">
                {hotel.ecofriendly_certificates.map((cert, index) => (
                  <span
                    key={index}
                    className="rounded bg-green-100 px-2 py-1 text-xs text-green-800"
                  >
                    {cert}
                  </span>
                ))}
              </div>
              <ul className="text-sm text-gray-600">
                {hotel.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
              <div className="flex items-center gap-2">
                <Button
                  // onClick={decrementNights}
                  size="icon"
                  variant="outline"
                >
                  <FaMinus />
                </Button>
                <Input
                  // type="number"
                  // value={nights}
                  // onChange={(e) => setNights(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center"
                  // min="1"
                />
                <Button
                  // onClick={incrementNights}
                  size="icon"
                  variant="outline"
                >
                  <FaPlus />
                </Button>
                <span>nights</span>
              </div>
              <DialogClose asChild>
                <Button
                // onClick={addToTotalBudget}
                >
                  Add to budget (₹
                  {/* {hotel.price_per_night * nights * totalPassenger}) */}
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HotelCard;
