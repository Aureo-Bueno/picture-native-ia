import { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { styles } from './styles';
import { Tip } from '../../components/Tip';
import { Item } from '../../components/Item';
import { Button } from '../../components/Button';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { usePostImageMutation } from '../../services/clarifai';

export function Home() {
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { mutateAsync } = usePostImageMutation();

  const handleSelectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        return Alert.alert("É necessário conceder permissão para acessar seu álbum!");
      }

      setIsLoading(true);
      const { canceled, assets } = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (canceled) {
        return setIsLoading(false);
      }

      if(!canceled) {
        const imaManipuled = await ImageManipulator.manipulateAsync(
          assets[0].uri,
          [{ resize: { width: 900 }}],
          {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

        setSelectedImageUri(imaManipuled.uri);
        foodDetect(imaManipuled.base64);
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const foodDetect = async (imageBase64: string | undefined) => {
    await mutateAsync(imageBase64, {
      onSuccess: () => {
        setIsLoading(false);
        Alert.alert("Completed");
      },
      onError: (error) => {
        console.log(`Erro ao enviar a imagem: ${error}`)
      },
    });
  } 

  return (
    <View style={styles.container}>
      <Button onPress={handleSelectImage} disabled={isLoading} />
      {selectedImageUri ? (
        <Image
          source={{ uri: selectedImageUri }}
          style={styles.image}
          resizeMode='cover'
        />
      ) : (
        <Text style={styles.description}>
          Selecione a foto do seu prato para analizar.
        </Text>
      )}

      <View style={styles.bottom}>
        <Tip message='Aqui vai uma dica' />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 24 }}
        >
          <View style={styles.items}>
            <Item data={{ name: 'Vegetal', percentage: '95%' }} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
