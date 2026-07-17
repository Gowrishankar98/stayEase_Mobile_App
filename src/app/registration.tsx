import { View, Text, TextInput, ImageBackground, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authApi } from '../api/auth';
import { setCredentials } from '../redux/authSlice';
import * as SecureStore from 'expo-secure-store';

export default function RegistrationScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!termsAccepted) {
      setError('You must accept the Terms & Conditions.');
      return;
    }
    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      // Send role 'user' since this is the customer-facing mobile app
      const data = await authApi.register({ name: fullName, email, password, role: 'user' });
      
      await SecureStore.setItemAsync('token', data.token);
      dispatch(setCredentials({
        user: data.user,
        token: data.token
      }));
      
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#051424]">
      <ImageBackground 
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR7iSug9rO6Ov8GW9L0dOB5bj2fYyl-gC7u1LqXoHHuxur5YL4Lg7TKSOOhuDucwE8rwDJVFO3VGAiVKS4Olv3XCffrovcYzA3AIwLQNYxyQwN1W96jjqRpal3x38aQ8bh03nVZDAeUrCe4O3AfvA_B1utyF6GN__NHCLQFeLVWs2_yn0-XVFXcU6dc621kphYL32l4O4951SY_T3POPAlWWnuvT2FW7UQh7mMDIc7PWpsuDcrISvX' }} 
        className="absolute w-full h-full opacity-40" 
      />
      <View className="absolute w-full h-full bg-[#051424]/70" />
      
      <SafeAreaView className="flex-1 w-full flex flex-col pt-4 pb-6">
        {/* Top Nav */}
        <View className="w-full px-6 flex-row items-center justify-between z-50 mb-8">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Ionicons name="arrow-back" size={20} color="#d4e4fa" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-[#d4e4fa]">StayEase</Text>
          <View className="w-10" />
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="w-full max-w-md self-center px-6">
          {/* Header Section */}
          <View className="mb-8">
            <Text className="text-4xl font-extrabold text-[#d4e4fa] mb-2">Create Account</Text>
            <Text className="text-base text-[#bccac0]">Join the pinnacle of modern living.</Text>
          </View>

          {/* Form Section */}
          <View className="space-y-4">
            {/* Full Name */}
            <View className="space-y-2">
              <Text className="text-xs font-semibold tracking-wider text-[#bccac0] uppercase ml-1 mb-2">Full Name</Text>
              <View className="relative justify-center">
                <Ionicons name="person" size={20} color="#bccac0" className="absolute left-4 z-10 top-[18px] opacity-50" />
                <TextInput 
                  className="bg-[#0b1c30]/60 border border-white/10 text-[#d4e4fa] rounded-xl h-14 pl-12 pr-4 font-medium"
                  placeholder="John Doe"
                  placeholderTextColor="rgba(188, 202, 192, 0.3)"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            {/* Email */}
            <View className="space-y-2 mt-4">
              <Text className="text-xs font-semibold tracking-wider text-[#bccac0] uppercase ml-1 mb-2">Email Address</Text>
              <View className="relative justify-center">
                <Ionicons name="mail" size={20} color="#bccac0" className="absolute left-4 z-10 top-[18px] opacity-50" />
                <TextInput 
                  className="bg-[#0b1c30]/60 border border-white/10 text-[#d4e4fa] rounded-xl h-14 pl-12 pr-4 font-medium"
                  placeholder="name@example.com"
                  placeholderTextColor="rgba(188, 202, 192, 0.3)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password */}
            <View className="space-y-2 mt-4">
              <Text className="text-xs font-semibold tracking-wider text-[#bccac0] uppercase ml-1 mb-2">Password</Text>
              <View className="relative justify-center">
                <Ionicons name="lock-closed" size={20} color="#bccac0" className="absolute left-4 z-10 top-[18px] opacity-50" />
                <TextInput 
                  className="bg-[#0b1c30]/60 border border-white/10 text-[#d4e4fa] rounded-xl h-14 pl-12 pr-12 font-medium"
                  placeholder="••••••••"
                  placeholderTextColor="rgba(188, 202, 192, 0.3)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-4 z-10 top-[18px] opacity-50">
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#bccac0" />
                </TouchableOpacity>
              </View>
            </View>

            {/* T&C Checkbox */}
            <View className="flex-row items-start space-x-3 mt-4">
              <TouchableOpacity onPress={() => setTermsAccepted(!termsAccepted)} className={`w-5 h-5 rounded border ${termsAccepted ? 'bg-[#065f46] border-[#065f46]' : 'bg-[#0b1c30]/50 border-white/10'} items-center justify-center mr-3 mt-1`}>
                {termsAccepted && <Ionicons name="checkmark" size={14} color="white" />}
              </TouchableOpacity>
              <Text className="flex-1 text-sm text-[#bccac0] leading-tight">
                I agree to the <Text className="text-[#68dba9]">Terms & Conditions</Text> and <Text className="text-[#68dba9]">Privacy Policy</Text>.
              </Text>
            </View>

            {error ? (
              <View className="bg-red-500/20 border border-red-500/50 p-3 rounded-xl mt-4">
                <Text className="text-red-400 text-sm text-center font-medium">{error}</Text>
              </View>
            ) : null}

            {/* Primary CTA */}
            <TouchableOpacity 
              onPress={handleRegister} 
              disabled={loading}
              className={`mt-6 w-full h-14 items-center justify-center rounded-full shadow-lg flex-row ${loading ? 'bg-[#065f46]/70' : 'bg-[#065f46]'}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-xl font-bold text-white">Create Account</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <View className="mt-8 mb-4">
            <View className="flex-row items-center space-x-4 mb-6">
              <View className="flex-1 h-[1px] bg-white/10" />
              <Text className="text-xs font-semibold text-[#bccac0] mx-4">OR CONTINUE WITH</Text>
              <View className="flex-1 h-[1px] bg-white/10" />
            </View>
            
            <View className="text-center mt-2 items-center">
              <Text className="text-base text-[#bccac0]">
                Already have an account?{' '}
                <Text onPress={() => router.push('/login')} className="text-xl font-bold text-[#68dba9]">
                  Sign In
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
