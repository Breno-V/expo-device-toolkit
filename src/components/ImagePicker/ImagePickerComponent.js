import React, { useState } from 'react';
import { View, Image, Alert, Pressable, Text, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './ImagePickerStyles';
import * as ImagePicker from 'expo-image-picker';
import { usePermission } from '../../hooks/usePermission';
import PermissionGate from '../PermissionGate/PermissionGate';

const ImagePickerComponent = () => {
    const [imageUri, setImageUri] = useState(null);
    const { status, canAskAgain, isLoading, requestPermission } = usePermission({
        getPermission: ImagePicker.getMediaLibraryPermissionsAsync,
        requestPermission: ImagePicker.requestMediaLibraryPermissionsAsync,
    });

    const selectImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (result.canceled) return;

        setImageUri(result.assets[0].uri);
    };

    const captureImage = async () => {
        const { status: cameraStatus } = await ImagePicker.getCameraPermissionsAsync();

        if (cameraStatus !== 'granted') {
            const { status: requestStatus, canAskAgain: cameraCanAsk } =
                await ImagePicker.requestCameraPermissionsAsync();

            if (requestStatus !== 'granted') {
                if (!cameraCanAsk) {
                    Alert.alert(
                        'Câmera bloqueada',
                        'Você bloqueou a permissão da câmera. Abra as configurações do sistema para ativar manualmente.',
                        [
                            { text: 'Cancelar', style: 'cancel' },
                            { text: 'Abrir Configurações', onPress: () => Linking.openSettings() },
                        ]
                    );
                } else {
                    Alert.alert('Permissão negada', 'Precisamos da permissão da câmera para capturar fotos.');
                }
                return;
            }
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (result.canceled) return;

        setImageUri(result.assets[0].uri);
    };

    return (
        <PermissionGate
            icon="image"
            title="Acessar sua galeria"
            description="Para selecionar fotos, precisamos da sua permissão para acessar as imagens da sua galeria."
            status={status}
            canAskAgain={canAskAgain}
            loading={isLoading}
            onRequest={requestPermission}
        >
            <View style={styles.container}>
                <View style={styles.buttonRow}>
                    <Pressable
                        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                        onPress={selectImage}
                    >
                        <Feather name="image" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Galeria</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                        onPress={captureImage}
                    >
                        <Feather name="camera" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Câmera</Text>
                    </Pressable>
                </View>

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
