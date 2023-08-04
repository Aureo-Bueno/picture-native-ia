import { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { styles } from './styles';
import { Tip } from '../../components/Tip';
import { Item } from '../../components/Item';
import { Button } from '../../components/Button';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { usePostImageMutation } from '../../services/clarifai';
import { ItemProps } from '../../components/Item/types';
import { Loading } from '../../components/Loading';
import { foodContains } from '../../utils/foodContains';

export function Home() {
  const [selectedImageUri, setSelectedImageUri] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { mutateAsync, data: itemResponse, isLoading: isLoadingResponse } = usePostImageMutation();
  const [item, setItem] = useState<Array<ItemProps>>([]);
  const [message, setMessage] = useState<string>('');

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

    const foods = itemResponse.data.outputs[0].data.concepts.map((concept: any) => {
      return {
        name: concept.name,
        percentage: `${Math.round(concept.value * 100)}%`
      }
    });

    const isVegetable = foodContains(foods, 'vegetable');
    setMessage(isVegetable ? '' : 'Adicione vegetais em seu prato!');
    setItem(foods);
    setIsLoading(false);
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
        {isLoadingResponse ? (
          <Loading />
        ) : (
          <>
            {message && <Tip message={message} />}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 24 }}
            >
              <View style={styles.items}>
                {item.map((item) => (
                  <Item key={item.name} data={item} />
                ))}
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
}
