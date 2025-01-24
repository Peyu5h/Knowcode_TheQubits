import { useRouter } from 'expo-router';
import { View, ScrollView, Image, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import SearchBox from '~/components/SearchBox';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Settings2, Search, Heart, MapPin, Star } from 'lucide-react-native';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useState } from 'react';
import { cn } from '~/lib/utils';
import { PortalHost } from '@rn-primitives/portal';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '~/components/ui/hover-card';
import { Skeleton } from '~/components/ui/skeleton';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoicGV5dTVoIiwiYSI6ImNtNG9mMms2NjA5NXQyanF6aWFoamlneHAifQ.5dT1m_VXoPx77m_nUAc6VQ';

const destinations = [
  {
    id: 1,
    name: 'Alibaug',
    location: 'Maharashtra',
    image:
      'https://hblimg.mmtcdn.com/content/hubble/img/desttvimg/mmt/destination/m_Alibaug_tv_destination_img_5_l_837_1255.jpg',
  },
  {
    id: 2,
    name: 'Taj Mahal',
    location: 'Agra',
    image:
      'https://hblimg.mmtcdn.com/content/hubble/img/agra/mmt/activities/m_activities-agra-taj-mahal_l_400_640.jpg',
  },
  {
    id: 3,
    name: 'Golden Temple,',
    location: 'Amristar',
    image:
      'https://hblimg.mmtcdn.com/content/hubble/img/amritsar/mmt/activities/m_activities_amritsar_golden_temple_l_427_639.jpg',
  },
  {
    id: 4,
    name: 'Coorg Hills',
    location: 'Karnataka',
    image: 'https://example.com/coorg.jpg',
  },
  {
    id: 5,
    name: 'Qutab Minar',
    location: 'Delhi',
    image:
      'https://hblimg.mmtcdn.com/content/hubble/img/delhi/mmt/activities/m_activities_delhi_qutab_minar_l_384_574.jpg',
  },
  {
    id: 6,
    name: 'Aguada Fort',
    location: 'Goa',
    image:
      'https://hblimg.mmtcdn.com/content/hubble/img/goa/mmt/activities/m_Fort%20Aguada_6_l_436_654.jpg',
  },
  {
    id: 7,
    name: 'Qutab Minar,',
    location: 'Delhi',
    image:
      'https://hblimg.mmtcdn.com/content/hubble/img/delhi/mmt/activities/m_activities_delhi_qutab_minar_l_384_574.jpg',
  },
];

const locationTypes = [
  { id: 1, name: 'Desert', active: false },
  { id: 2, name: 'Mountain', active: false },
  { id: 3, name: 'Jungle', active: false },
  { id: 4, name: 'Beach', active: false },
  { id: 5, name: 'Plains', active: false },
];

const DestinationCard = ({ destination, onPress }: { destination: any; onPress: () => void }) => (
  <Pressable onPress={onPress}>
    <Card className="w-[220px] h-[280px] rounded-3xl overflow-hidden mr-4">
      <View className="relative h-full">
        <Image
          source={{ uri: destination.image }}
          className="absolute w-full h-full"
          style={{ resizeMode: 'cover' }}
        />
        <View className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <View className="absolute top-3 right-3">
          <Pressable className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md items-center justify-center">
            <Heart color="white" size={12} />
          </Pressable>
        </View>

        <View className="absolute bottom-0 p-4 w-full">
          <Text className="text-white text-lg font-bold">{destination.name}</Text>
          <View className="flex-row items-center space-x-2 mt-1">
            <MapPin size={14} color="white" className="text-white/80" />
            <Text className="text-white/80 text-sm">{destination.location}</Text>
          </View>
        </View>
      </View>
    </Card>
  </Pressable>
);

export default function Index() {
  const router = useRouter();
  const [activeType, setActiveType] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState('All');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLocationSelect = (lat: number, lng: number, attractions?: any[], query?: string) => {
    setIsLoading(true);

    const filteredResults = destinations.filter((dest) =>
      dest.location.toLowerCase().includes(query?.toLowerCase() || '')
    );

    setTimeout(() => {
      setSearchResults(filteredResults);
      setSearchQuery(query || '');
      setIsLoading(false);
    }, 1000); // Simulate loading delay
  };

  const SearchResultsLoader = () => (
    <View className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="w-full h-[280px] rounded-3xl overflow-hidden">
          <View className="p-4">
            <Skeleton className="h-[200px] w-full rounded-2xl mb-4" />
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </View>
        </Card>
      ))}
    </View>
  );

  const renderDestinations = () => {
    if (searchQuery && isLoading) {
      return <SearchResultsLoader />;
    }

    if (searchQuery && searchResults.length > 0) {
      return (
        <View className="space-y-4 mt-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-semibold">Results for "{searchQuery}"</Text>
            <Pressable
              onPress={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
            >
              <Text className="text-sm text-primary">Clear search</Text>
            </Pressable>
          </View>

          <ScrollView
            className="space-y-4"
            horizontal
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {searchResults.map((result) => (
              <DestinationCard
                key={result.id}
                destination={result}
                onPress={() => router.push(`/(tabs)/(user)/plan?location=${result.location}`)}
              />
            ))}
          </ScrollView>
        </View>
      );
    }

    return (
      <View className="mb-4 mt-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-semibold">Top destination</Text>
          <Text className="text-sm text-primary">See all</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-4">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onPress={() => router.push(`/(tabs)/(user)/plan?location=${destination.location}`)}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <View className="relative h-[300px] mb-6">
        <Image
          source={{
            uri: 'https://res.cloudinary.com/dkysrpdi6/image/upload/v1737723421/sada_stlvvy.png',
          }}
          className="absolute w-full h-full"
          style={{ resizeMode: 'cover' }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
          }}
        />
        <View className="absolute left-4 right-4 top-2  mt-4">
          <SearchBox
            onLocationSelect={handleLocationSelect}
            MAPBOX_ACCESS_TOKEN={MAPBOX_ACCESS_TOKEN}
          />
        </View>
        <View style={{ marginTop: 220 }} className="p-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white/80">Good Morning Piyush</Text>
              <Text className="text-2xl font-bold text-white">Start new adventure</Text>
            </View>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Pressable>
                  <View className="relative">
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#FFD700',
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: -2, height: -2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                      }}
                    >
                      <Text className="text-xl font-bold text-white">$</Text>
                    </View>
                    <View className="absolute -top-2 -right-2 bg-primary rounded-full px-2 py-0.5">
                      <Text className="text-xs font-bold">250</Text>
                    </View>
                  </View>
                </Pressable>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 native:w-96">
                <View className="gap-4">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-lg font-bold">Your Coins</Text>
                    <Text className="text-2xl font-bold text-primary">250</Text>
                  </View>
                  <View className="gap-2">
                    <Text className="text-sm text-muted-foreground">
                      Use your coins to unlock special offers and discounts
                    </Text>
                    <Button className="w-full" variant="default">
                      <Text className="text-white">Claim Now</Text>
                    </Button>
                  </View>
                </View>
              </HoverCardContent>
            </HoverCard>
          </View>
        </View>
      </View>

      <View className="px-4 ">
        <View className="mb-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3">
            {locationTypes.map((type) => (
              <Pressable
                key={type.id}
                onPress={() => setActiveType(type.id)}
                className={`flex-row items-center px-8 h-12 py-2 rounded-full mr-4 ${
                  activeType === type.id ? 'bg-primary' : 'bg-secondary'
                }`}
              >
                <Text className={`${activeType === type.id ? 'text-black' : 'text-foreground'}`}>
                  {type.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {renderDestinations()}
      </View>
      <PortalHost name="dropdown" />
    </View>
  );
}
