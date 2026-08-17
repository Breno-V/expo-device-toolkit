import React, { useState } from 'react';
import { View, Image, Alert, Pressable, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './ImagePickerStyles';
import * as ImagePicker from 'expo-image-picker';
import { usePermission } from '../../hooks/usePermission';
import PermissionGate from '../PermissionGate/PermissionGate';

const ImagePickerComponent = () => {
    const [imageUri, setImageUri] = useState(null);
    const { status, isLoading, requestPermission } = usePermission({
        getPermission: ImagePicker.getMediaLibraryPermissionsAsync,
        requestPermission: ImagePicker.requestMediaLibraryPermissionsAsync,
    });

    const selectImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1, // melhor qualidade
        });

        if (result.canceled) {
            Alert.alert('Operação Cancelada!', 'Você cancelou a seleção de imagem');
            return;
        }

        setImageUri(result.assets[0].uri);
    }

    return (
        <PermissionGate
            icon="image"
            title="Acessar sua galeria"
            description="Para selecionar fotos, precisamos da sua permissão para acessar as imagens da sua galeria."
            status={status}
            loading={isLoading}
            onRequest={requestPermission}
        >
            <View style={styles.container}>
                <Pressable
                    style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                    onPress={selectImage}
                >
                    <Feather name="image" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Selecionar Imagens</Text>
                </Pressable>

                <View style={styles.previewArea}>
                    {imageUri && (
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}
                </View>
            </View>
        </PermissionGate>
    );
};

export default ImagePickerComponent;
