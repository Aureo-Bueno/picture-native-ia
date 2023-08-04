import { StatusBar } from 'expo-status-bar';
import { Loading } from './src/components/Loading';
import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { Home } from './src/screens/Home';

export default function App() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });

  return (
    <>
      {fontsLoaded && (
        <Loading />
      )}
      <StatusBar
        style='dark'
        backgroundColor='transparent'
        translucent
      />
      <Home />
    </>
  );
}