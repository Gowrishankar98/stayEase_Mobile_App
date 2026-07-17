import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#051424] items-center justify-center relative">
      <View className="flex-1 items-center justify-center w-full max-w-sm px-6 z-10">
        <View className="w-48 h-48 rounded-3xl overflow-hidden bg-[#122131]/50 border border-white/10 flex items-center justify-center p-4">
          <Image 
            source={require('../../assets/screen_1_logo.png')} 
            className="w-full h-full"
            resizeMode="contain" 
          />
        </View>
        <View className="text-center mt-4 items-center">
          <Text className="text-5xl font-extrabold text-[#059669] tracking-tighter">StayEase</Text>
          <Text className="text-xs text-[#bccac0] font-light tracking-widest uppercase mt-2">
            The Pinnacle of Modern Living
          </Text>
        </View>
      </View>
      <View className="absolute bottom-16 w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="#68dba9" />
      </View>
    </SafeAreaView>
  );
}
