import { Text, View } from 'react-native';
import { styles} from './styles'
import { IItem } from './types';

export function Item({ data }: IItem) {
  const { name, percentage } = data;
  return (
    <View style={styles.container}>
      <Text style={styles.percentage}>
        {percentage}
      </Text>

      <Text style={styles.title}>
        {name}
      </Text>
    </View>
  );
}