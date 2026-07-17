import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/authSlice';
import * as SecureStore from 'expo-secure-store';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    dispatch(logout());
    router.replace('/login');
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

      <ScrollView className="flex-1 pt-28 px-6 pb-24" showsVerticalScrollIndicator={false}>
        {/* Profile Hero */}
        <View className="items-center mb-8">
          <View className="relative mb-4">
            <View className="w-32 h-32 rounded-full border-4 border-[#68dba9]/20 overflow-hidden bg-white/10 items-center justify-center">
              <Ionicons name="person" size={64} color="#68dba9" />
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 bg-[#68dba9] w-10 h-10 rounded-full items-center justify-center border-4 border-[#051424]">
              <Ionicons name="pencil" size={18} color="#003825" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-3xl font-bold text-[#d4e4fa] mb-2">{user?.name || 'Guest User'}</Text>
          <Text className="text-[#bccac0] mb-4">{user?.email || 'No email provided'}</Text>
          <View className="flex-row items-center justify-center space-x-3">
            <View className="px-4 py-1 bg-[#68dba9]/10 border border-[#68dba9]/30 rounded-full mr-2">
              <Text className="text-[#68dba9] text-xs font-bold uppercase tracking-wider">{user?.role || 'User'}</Text>
            </View>
            <View className="flex-row items-center space-x-1">
              <Ionicons name="checkmark-circle" size={16} color="#bccac0" className="mr-1" />
              <Text className="text-[#bccac0]">Verified</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <Text className="text-[#bccac0] text-xs uppercase tracking-widest mb-4">Account Summary</Text>
          
          <View className="border-b border-white/10 pb-4 mb-4 flex-row justify-between items-end">
            <View>
              <Text className="text-[#bccac0] mb-1">Total Stays</Text>
              <Text className="text-[#68dba9] text-2xl font-bold">0</Text>
            </View>
            <Ionicons name="bed" size={24} color="rgba(104,219,169,0.5)" />
          </View>
          
          <View className="border-b border-white/10 pb-4 flex-row justify-between items-end">
            <View>
              <Text className="text-[#bccac0] mb-1">Points Earned</Text>
              <Text className="text-[#68dba9] text-2xl font-bold">0</Text>
            </View>
            <Ionicons name="star" size={24} color="rgba(104,219,169,0.5)" />
          </View>
        </View>

        {/* Menu Options */}
        <View className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-6">
          <TouchableOpacity className="flex-row items-center p-5 border-b border-white/10">
            <Ionicons name="person-outline" size={24} color="#68dba9" className="mr-4" />
            <Text className="flex-1 text-[#d4e4fa] text-lg">Personal Information</Text>
            <Ionicons name="chevron-forward" size={20} color="#bccac0" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center p-5 border-b border-white/10">
            <Ionicons name="card-outline" size={24} color="#68dba9" className="mr-4" />
            <Text className="flex-1 text-[#d4e4fa] text-lg">Payment Methods</Text>
            <Ionicons name="chevron-forward" size={20} color="#bccac0" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center p-5">
            <Ionicons name="settings-outline" size={24} color="#68dba9" className="mr-4" />
            <Text className="flex-1 text-[#d4e4fa] text-lg">Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#bccac0" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={handleLogout}
          className="border border-red-500/50 rounded-xl p-4 items-center mb-8 bg-red-500/10"
        >
          <Text className="text-red-500 font-bold text-lg">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
