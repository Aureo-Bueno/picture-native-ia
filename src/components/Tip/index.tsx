import { Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { ITips } from './types';



export function Tip({ message }: ITips) {
  return (
    <View style={styles.container}>
      <MaterialIcons
        name="restaurant"
        color="#FFFFFF"
        size={24}
      />
      <Text style={styles.message}>
        {message}
      </Text>
    </View>
  );
}