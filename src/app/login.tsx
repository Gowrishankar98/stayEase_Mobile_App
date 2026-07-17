import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { ActivityIndicator, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { authApi } from '../api/auth';
import { setCredentials } from '../redux/authSlice';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await authApi.login({ email, password });
      console.log('DATA----->', data);
      // Store token securely
      await SecureStore.setItemAsync('token', data.token);

      dispatch(setCredentials({
        user: data.user,
        token: data.token
      }));

      router.replace('/(tabs)/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#0b1c30]">
      <ImageBackground
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaQAaKCj239_qmnxaBpHllp2OBBZ6N_-ZyLNRse3Cl11sHytiU5lsmBtWqezMYwmT_Oj7-piGDbPX9Iw2Mx1RL_4fZKWKWq_BAjOWXrH--yovmk72ANDiL2UYbikWgpSYJcvxQmqoEz2isXghYChuMQDL_2TeiVc150qEFQsVSVj_LvhafVdaqr3pJ8cwBIOtxKG3mFL-zTobBhiRBKExaZuVWjR-bKSkB58smPiLsoHF9kf8Q7zrh' }}
        className="absolute w-full h-full opacity-30"
      />
      <View className="absolute w-full h-full bg-[#06111d]/80" />

      <SafeAreaView className="flex-1 w-full px-6 flex flex-col justify-between max-w-[420px] self-center">
        {/* Top Nav */}
        {/* <View className="w-full flex-row justify-start mt-4 mb-8">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Ionicons name="arrow-back" size={20} color="#d4e4fa" />
          </TouchableOpacity>
        </View> */}

        {/* Login Form Content */}
        <View className="w-full flex-grow flex flex-col justify-center">
          <View className="mb-10">
            <Text className="text-4xl font-extrabold text-[#d4e4fa] mb-2 tracking-tighter">Welcome Back</Text>
            <Text className="text-base text-[#bccac0]">Sign in to continue your journey with StayEase.</Text>
          </View>

          <View className="space-y-5">
            {/* Email Field */}
            <View className="space-y-2">
              <Text className="text-xs font-semibold tracking-wider text-[#d4e4fa] ml-1 mb-2">Email Address</Text>
              <View className="relative justify-center">
                <Ionicons name="mail" size={20} color="#bccac0" className="absolute left-4 z-10 top-[14px]" />
                <TextInput
                  className="bg-[#051424]/60 border border-white/10 text-[#d4e4fa] rounded-xl py-3.5 pl-12 pr-4 font-medium"
                  placeholder="hello@example.com"
                  placeholderTextColor="rgba(188, 202, 192, 0.5)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="space-y-2 mt-5">
              <Text className="text-xs font-semibold tracking-wider text-[#d4e4fa] ml-1 mb-2">Password</Text>
              <View className="relative justify-center">
                <Ionicons name="lock-closed" size={20} color="#bccac0" className="absolute left-4 z-10 top-[14px]" />
                <TextInput
                  className="bg-[#051424]/60 border border-white/10 text-[#d4e4fa] rounded-xl py-3.5 pl-12 pr-12 font-medium"
                  placeholder="••••••••"
                  placeholderTextColor="rgba(188, 202, 192, 0.5)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-4 z-10 top-[14px]">
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#bccac0" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <View className="flex-row justify-end pt-2 mt-2">
              <TouchableOpacity>
                <Text className="text-xs font-semibold text-[#68dba9]">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {error ? (
              <View className="bg-red-500/20 border border-red-500/50 p-3 rounded-xl mt-2">
                <Text className="text-red-400 text-sm text-center font-medium">{error}</Text>
              </View>
            ) : null}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className={`w-full rounded-full py-4 mt-6 flex-row items-center justify-center space-x-2 ${loading ? 'bg-[#047857]/70' : 'bg-[#047857]'}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text className="text-xl font-bold text-white mr-2">Sign In</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Link */}
        <View className="w-full items-center mt-auto pb-6">
          <Text className="text-base font-medium text-[#bccac0]">
            Don't have an account?{' '}
            <Text onPress={() => router.push('/registration')} className="text-lg font-bold text-[#68dba9]">
              Sign Up
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
