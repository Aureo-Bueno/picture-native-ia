import { useMutation } from '@tanstack/react-query';
import { api } from '../client'


const postImage = async (imageBase64: string | undefined) => {
  const { data } = await api.post(`/v2/models/${process.env.EXPO_PUBLIC_MODEL_ID}/version/${process.env.EXPO_PUBLIC_API_MODEL_VERSION_ID}/outputs`, {
    "user_app_id": {
       "user_id": process.env.EXPO_PUBLIC_API_USER_ID,
       "app_id": process.env.EXPO_PUBLIC_API_APP_ID,
    },
    "inputs": [
      {
        "data": {
            "image": {
                "base64": imageBase64
            }
        }
      }
    ]
  });
  return data;
}

export const usePostImageMutation = () => useMutation(
  (imageBase64: string | undefined) => postImage(imageBase64)
);
