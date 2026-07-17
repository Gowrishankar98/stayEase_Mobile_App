import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { bookingService } from '../../api/bookings';

const pastBookings = [
  {
    id: '3',
    name: 'Azure Infinity Suite',
    dates: 'August 2024 • Santorini',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDn-nm_xlw2QFkXjypc9EkpIYwheRzFst3awtPQ3yqBOiYcg2LT7DVPSO58d1FQ5GJ3cdAUCYmJXnWnwd3rnmctUL2aOwFUpNAe3lvPs-18XwHvRoC_0_EX3KuffTru6GFgQmim5pl9qLHrNcjwLQZ0Oc2VF1p4QyGik5t5ok2IM_KspyHjd1vZnBNbMBY8J3QZCpS_auyp_ZNECp3l-djYR17ilq4sZDJgZJyUt5zSVNLj-Au-oS6'
  }
];

export default function BookingsScreen() {
  const router = useRouter();
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getBookings();
      setUpcomingBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  return (
    <View className="flex-1 bg-[#051424]">
      {/* TopAppBar */}
      <View className="absolute top-0 left-0 w-full z-50 h-24 pt-10 bg-[#051424]/80 flex-row justify-between items-center px-6 border-b border-white/10">
        <View className="flex-row items-center space-x-4">
          <Ionicons name="menu" size={28} color="#68dba9" />
          <Text className="text-2xl font-extrabold text-[#d4e4fa] tracking-tighter">StayEase</Text>
        </View>
        <Ionicons name="notifications" size={24} color="#68dba9" />
      </View>

      <ScrollView 
        className="flex-1 pt-28 px-6 pb-24" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#68dba9" />
        }
      >
        {/* Header Section */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-[#d4e4fa] mb-2">My Bookings</Text>
          <Text className="text-[#bccac0] text-base">Manage your upcoming retreats and revisit past architectural journeys across the globe.</Text>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 h-12">
          <TouchableOpacity className="px-6 py-2 rounded-full bg-[#68dba9] mr-4 h-10 items-center justify-center shadow-md">
            <Text className="text-[#003825] font-bold text-xs">Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-6 py-2 rounded-full bg-white/5 border border-white/10 mr-4 h-10 items-center justify-center">
            <Text className="text-[#d4e4fa] font-semibold text-xs">Past Stays</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-6 py-2 rounded-full bg-white/5 border border-white/10 h-10 items-center justify-center">
            <Text className="text-[#d4e4fa] font-semibold text-xs">Canceled</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Upcoming Bookings List */}
        <View className="space-y-6">
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#68dba9" className="py-10" />
          ) : upcomingBookings.length === 0 ? (
            <View className="py-10 items-center justify-center bg-white/5 border border-white/10 rounded-xl">
              <Text className="text-[#bccac0]">No upcoming bookings found.</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/home')} className="mt-4 px-6 py-2 bg-[#68dba9] rounded-full">
                <Text className="text-[#003825] font-bold">Explore Residences</Text>
              </TouchableOpacity>
            </View>
          ) : (
            upcomingBookings.map((booking) => (
              <TouchableOpacity key={booking._id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-6">
                <View className="relative h-64 overflow-hidden bg-black/40 items-center justify-center">
                  {/* Assuming image is not in booking data, use placeholder */}
                  <Ionicons name="home" size={48} color="#bccac0" className="opacity-50" />
                  <View className="absolute top-4 left-4 bg-[#68dba9] px-3 py-1 rounded-full flex-row items-center space-x-1">
                    <Ionicons name={booking.status === 'CONFIRMED' ? "checkmark-circle" : "time"} size={14} color="#003825" className="mr-1" />
                    <Text className="text-[#003825] font-bold text-xs">{booking.status || 'CONFIRMED'}</Text>
                  </View>
                </View>
                
                <View className="p-6">
                  <View className="flex-row justify-between items-start mb-4">
                    <Text className="text-xl font-bold text-[#d4e4fa]">{booking.property}</Text>
                  </View>

                  <View className="space-y-3 mb-6">
                    <View className="flex-row items-center space-x-3">
                      <Ionicons name="calendar-outline" size={20} color="#bccac0" className="mr-2" />
                      <Text className="text-[#bccac0]">{booking.checkIn} — {booking.checkOut}</Text>
                    </View>
                    <View className="flex-row items-center space-x-3 mt-2">
                      <Ionicons name="location-outline" size={20} color="#bccac0" className="mr-2" />
                      <Text className="text-[#bccac0]">{booking.location}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center space-x-3 pt-4 border-t border-white/10">
                    <TouchableOpacity className="flex-1 bg-[#68dba9] py-3 rounded-full items-center justify-center mr-2">
                      <Text className="text-[#003825] font-bold text-sm">Manage Stay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="w-12 h-12 bg-white/5 border border-white/10 rounded-full items-center justify-center">
                      <Ionicons name="map" size={20} color="#bccac0" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Past Bookings */}
        <View className="mt-8 pt-6 border-t border-white/10">
          <Text className="text-2xl font-bold text-[#d4e4fa] mb-6 opacity-60">Past Stays</Text>
          <View className="space-y-6">
            {pastBookings.map((booking) => (
              <TouchableOpacity key={booking.id} className="bg-white/5 border-2 border-dashed border-white/10 rounded-xl overflow-hidden mb-6 opacity-70">
                <View className="relative h-48 overflow-hidden">
                  <Image source={{ uri: booking.image }} className="w-full h-full grayscale" />
                </View>
                <View className="p-6">
                  <Text className="text-lg font-bold text-[#d4e4fa] mb-1">{booking.name}</Text>
                  <Text className="text-[#bccac0] text-sm mb-4">{booking.dates}</Text>
                  <Text className="text-[#68dba9] font-bold text-xs underline">View Details</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
