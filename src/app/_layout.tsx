import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import '../global.css';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="registration" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="apartment/[id]" />
      </Stack>
    </Provider>
  );
}
