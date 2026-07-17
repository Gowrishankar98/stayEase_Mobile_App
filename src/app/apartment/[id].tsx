import { View, Text, ScrollView, ImageBackground, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { listingService } from '../../api/listings';
import { bookingService } from '../../api/bookings';

export default function ApartmentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await listingService.getApartmentById(id as string);
        setProperty(data);
      } catch (error) {
        console.error('Failed to fetch property details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  const handleReserve = async () => {
    try {
      setBookingLoading(true);
      
      // Auto-generate booking dates (tomorrow to 3 days later)
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + 1);
      const checkOut = new Date();
      checkOut.setDate(checkOut.getDate() + 4);

      await bookingService.createBooking({
        guest: {
          name: 'Mobile User',
          email: 'user@example.com'
        },
        property: property.name,
        location: property.location || 'Unknown',
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        nights: 3,
        totalAmount: (property.pricePerNight || 2500) * 3,
        status: 'CONFIRMED'
      });

      Alert.alert('Success', 'Your booking has been confirmed!', [
        { text: 'View Bookings', onPress: () => router.replace('/(tabs)/bookings') },
        { text: 'OK' }
      ]);
    } catch (error: any) {
      console.error('Booking failed:', error);
      Alert.alert('Booking Failed', error.response?.data?.message || 'Please try again later.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#051424] justify-center items-center">
        <ActivityIndicator size="large" color="#68dba9" />
      </View>
    );
  }

  if (!property) {
    return (
      <View className="flex-1 bg-[#051424] justify-center items-center">
        <Text className="text-white">Property not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 px-4 py-2 bg-[#68dba9] rounded-full">
          <Text className="text-black font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageUrl = property.image 
    ? property.image.replace("w=150", "w=800") 
    : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";

  const rating = (4.5 + (property.name.length % 5) * 0.1).toFixed(1);

  return (
    <View className="flex-1 bg-[#051424]">
      {/* Top Navigation */}
      <View className="absolute top-0 z-50 w-full flex-row justify-between items-center px-6 pt-12 pb-4 bg-[#051424]/80 border-b border-white/10">
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/5 items-center justify-center">
            <Ionicons name="arrow-back" size={24} color="#68dba9" />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white/5 items-center justify-center mr-2">
            <Ionicons name="heart-outline" size={24} color="#bccac0" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white/5 items-center justify-center">
            <Ionicons name="share-outline" size={24} color="#bccac0" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 pt-28" showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <View className="px-6 mb-8">
          <View className="h-80 w-full rounded-2xl overflow-hidden relative">
            <ImageBackground 
              source={{ uri: imageUrl }}
              className="w-full h-full"
            />
            <View className="absolute bottom-6 left-6 bg-black/40 border border-white/20 rounded-full px-4 py-2 flex-row items-center space-x-2">
              <Ionicons name="star" size={16} color="#68dba9" className="mr-1" />
              <Text className="text-[#d4e4fa] font-bold text-sm">{rating} <Text className="font-normal text-xs text-[#bccac0]">(124 reviews)</Text></Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 pb-32">
          {/* Header Info */}
          <View className="border-b border-white/10 pb-6 mb-6">
            <Text className="text-3xl font-bold text-[#d4e4fa] mb-3">{property.name}</Text>
            <View className="flex-row items-center flex-wrap gap-y-2">
              <View className="flex-row items-center space-x-1 mr-3">
                <Ionicons name="location" size={14} color="#68dba9" className="mr-1" />
                <Text className="text-[#bccac0] text-sm">{property.location}</Text>
              </View>
              <Text className="text-white/20 mr-3">•</Text>
              <View className="flex-row items-center space-x-1 mr-3">
                <Ionicons name="person" size={14} color="#68dba9" className="mr-1" />
                <Text className="text-[#bccac0] text-sm">{property.maxGuests || 4} Guests</Text>
              </View>
              <Text className="text-white/20 mr-3">•</Text>
              <View className="flex-row items-center space-x-1">
                <Ionicons name="bed" size={14} color="#68dba9" className="mr-1" />
                <Text className="text-[#bccac0] text-sm">{property.type || "Apartment"}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-[#d4e4fa] mb-4">About this place</Text>
            <Text className="text-[#bccac0] leading-6 mb-4">
              {property.description}
            </Text>
          </View>

          {/* Amenities */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-[#d4e4fa] mb-6">Premium Amenities</Text>
            <View className="flex-row flex-wrap gap-y-6">
              {property.amenities?.wifi && (
                <View className="w-1/2 flex-row items-center pr-2">
                  <View className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 items-center justify-center mr-3">
                    <Ionicons name="wifi" size={24} color="#68dba9" />
                  </View>
                  <Text className="text-[#bccac0] text-xs flex-1">Ultra-fast Wi-Fi</Text>
                </View>
              )}
              {property.amenities?.parking && (
                <View className="w-1/2 flex-row items-center pr-2">
                  <View className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 items-center justify-center mr-3">
                    <Ionicons name="car-outline" size={24} color="#68dba9" />
                  </View>
                  <Text className="text-[#bccac0] text-xs flex-1">Secure Parking</Text>
                </View>
              )}
              {property.amenities?.pool && (
                <View className="w-1/2 flex-row items-center pr-2">
                  <View className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 items-center justify-center mr-3">
                    <Ionicons name="water-outline" size={24} color="#68dba9" />
                  </View>
                  <Text className="text-[#bccac0] text-xs flex-1">Swimming Pool</Text>
                </View>
              )}
              {property.amenities?.gym && (
                <View className="w-1/2 flex-row items-center pr-2">
                  <View className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 items-center justify-center mr-3">
                    <Ionicons name="barbell-outline" size={24} color="#68dba9" />
                  </View>
                  <Text className="text-[#bccac0] text-xs flex-1">Fitness Center</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Book Bar */}
      <View className="absolute bottom-0 w-full bg-[#051424]/90 border-t border-white/10 px-6 py-4 flex-row justify-between items-center pb-8">
        <View>
          <Text className="text-2xl font-bold text-[#d4e4fa]">₹{property.pricePerNight || 2500} <Text className="text-[#bccac0] text-sm font-normal">/ night</Text></Text>
          <Text className="text-[#68dba9] text-xs underline mt-1">Total: ₹{(property.pricePerNight || 2500) * 3} for 3 nights</Text>
        </View>
        <TouchableOpacity 
          onPress={handleReserve}
          disabled={bookingLoading}
          className={`px-8 py-4 rounded-full flex-row items-center justify-center ${bookingLoading ? 'bg-[#065f46]/70' : 'bg-[#065f46]'}`}
        >
          {bookingLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Reserve</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
