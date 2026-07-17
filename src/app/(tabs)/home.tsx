import { View, Text, ScrollView, ImageBackground, Image, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { listingService } from '../../api/listings';

const collections = [
  { id: '1', name: 'Architectural Gems', desc: '12 stunning structures', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUgMGHlmuWZJp12aQZQfcqEmHd5sLloNC6Ax39NRn8StdUZSUyBTgPFnB4lAXSswE9tNQqkWV5aI5lTMydzVSTGC_0yL1bgWBbtp3ibiW0g9M5cRvxTwc_bclVzaI_9AKYVVl40TIrlEJyYhI-DVMT5V_Fkeu1T3F4-jFxOYi8roHQuOZSkLt6Z4JGbsQLNU_BBPwSDJGppFblfO5sv_QAzvhRNUSLxQEGVPZkQvMwFqdbT8bhfRhR' },
  { id: '2', name: 'Winter Sanctuaries', desc: '8 secluded mountain retreats', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1sdFUp7RVTiAxelONtCku2nabqFrEU_dVqd-9EG5ov3fHd0vFdJU9rm35tSnr-ATRWU_eYm-ze2TNWxktjgT6c9vnRCZXUjMhnJZYA8BR4ipd8STp2RHpT1Kip1fR8RdzU7zJV64DLZPl__nGCQghygyZ2JHv9nhcHZADHRYPr416MdZY3b2901V_Cq-jF_7hsowNUXnOdSyX11gjw7z-mVbRvoxSoz3T1IlWfwoWS3pHxhd_eMYO' }
];

export default function HomeScreen() {
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProperties = async () => {
    try {
      const data = await listingService.getApartments();
      setProperties(data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProperties();
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
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#68dba9" />
        }
      >
        {/* Hero Section */}
        <View className="w-full h-[85vh] relative justify-end">
          <ImageBackground 
            source={{ uri: 'https://lh3.googleusercontent.com/aida/AP1WRLu6NiEu8eD0PG6X9kzMm9QArZouA1CPmHaI9hV1bUxctCWFciYtTN2zvYIWK4s2XgjJK3szL72gqKffBQf9b90iWKxBCZ2ezAyh0GDKUkPRQlIXYKeDi6Tehso4VCdKD0QnIkJ7jnlHncse35zW7En6_zt3e48wFYT4_9sCbWhBSiWHo456Sc4OCLQIqDBGV60UHFP0-LEHr4xp9iBuuYIy7ZwDO26oX6M6ftKd2AXU917dND6emrN8Gw' }}
            className="absolute inset-0 w-full h-full"
          />
          <View className="absolute inset-0 bg-[#051424]/40" />
          
          <View className="px-6 pb-12 z-10">
            <View className="bg-white/5 border border-[#68dba9]/20 self-start px-4 py-1 rounded-full mb-4">
              <Text className="text-[#68dba9] text-xs font-bold uppercase tracking-widest">Global Curations</Text>
            </View>
            <Text className="text-5xl font-extrabold text-white mb-6">
              The Pinnacle of <Text className="text-[#68dba9]">Modern Living</Text>
            </Text>
            <TouchableOpacity className="bg-[#68dba9] px-8 py-4 rounded-full self-start shadow-lg" onPress={() => {}}>
              <Text className="text-[#003825] font-bold text-lg">Explore Residences</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Residences */}
        <View className="py-12 pl-6">
          <View className="flex-row justify-between items-end pr-6 mb-8">
            <View>
              <Text className="text-3xl font-bold text-[#d4e4fa]">Featured</Text>
              <Text className="text-[#bccac0] mt-1">Exceptional architectural masterpieces</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-[#68dba9] font-bold">View All</Text>
            </TouchableOpacity>
          </View>

          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#68dba9" className="py-10 pr-6" />
          ) : (
            <FlatList 
              horizontal
              showsHorizontalScrollIndicator={false}
              data={properties}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ paddingRight: 24 }}
              renderItem={({ item }) => {
                const imageUrl = item.image 
                  ? item.image.replace("w=150", "w=800") 
                  : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";
                
                // Calculate dynamic rating like frontend
                const rating = (4.5 + (item.name.length % 5) * 0.1).toFixed(1);

                return (
                  <TouchableOpacity 
                    className="w-80 mr-6" 
                    onPress={() => router.push(`/apartment/${item._id}`)}
                  >
                    <View className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4">
                      <Image source={{ uri: imageUrl }} className="w-full h-full" />
                      <View className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-lg flex-row items-center space-x-1">
                        <Ionicons name="star" size={12} color="#68dba9" />
                        <Text className="text-[#d4e4fa] font-bold text-xs">{rating}</Text>
                      </View>
                    </View>
                    <Text className="text-xl font-bold text-[#d4e4fa]" numberOfLines={1}>{item.name}</Text>
                    <Text className="text-[#bccac0] mb-2" numberOfLines={1}>{item.location}</Text>
                    <Text className="text-xl font-bold text-[#68dba9]">₹{item.pricePerNight || 2500}<Text className="text-[#bccac0] text-sm font-normal"> / night</Text></Text>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={() => (
                <View className="w-80 mr-6 justify-center items-center py-10 bg-white/5 rounded-xl border border-white/10">
                  <Text className="text-[#bccac0]">No residences available.</Text>
                </View>
              )}
            />
          )}
        </View>

        {/* Curated Collections */}
        <View className="py-6 px-6 pb-24">
          <Text className="text-3xl font-bold text-[#d4e4fa] mb-8">Collections</Text>
          {collections.map((item) => (
            <TouchableOpacity key={item.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex-row items-center mb-4">
              <Image source={{ uri: item.image }} className="w-20 h-20 rounded-xl mr-4" />
              <View className="flex-1">
                <Text className="text-lg font-bold text-[#d4e4fa]">{item.name}</Text>
                <Text className="text-[#bccac0]">{item.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#68dba9" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
