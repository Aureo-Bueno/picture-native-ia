import { StatusBar } from 'expo-status-bar';
import { Loading } from './src/components/Loading';
import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { Home } from './src/screens/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

export default function App() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });

  return (
    <QueryClientProvider client={queryClient}>
      {fontsLoaded && (
        <Loading />
      )}
      <StatusBar
        style='dark'
        backgroundColor='transparent'
        translucent
      />
      <Home />
    </QueryClientProvider>
  );
}