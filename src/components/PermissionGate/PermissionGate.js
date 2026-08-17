import React from 'react';
import { View, Text, ActivityIndicator, Pressable, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './PermissionGateStyles';

const PermissionGate = ({
    icon,
    title,
    description,
    status,
    canAskAgain = true,
    loading,
    onRequest,
    children,
}) => {
    if (status === 'granted') {
        return children;
    }

    if (status === null) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!canAskAgain) {
        return (
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <Feather name="alert-circle" size={40} color="#FF3B30" />
                </View>

                <Text style={styles.title}>Permissão Bloqueada</Text>
                <Text style={styles.description}>
                    Você negou esta permissão e marcou "Não perguntar novamente".
                    Para continuar, abra as configurações do sistema e ative manualmente.
                </Text>

                <Pressable
                    style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                    onPress={() => Linking.openSettings()}
                >
                    <Text style={styles.buttonText}>Abrir Configurações</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Feather name={icon} size={40} color="#007AFF" />
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    loading && styles.buttonDisabled,
                ]}
                onPress={onRequest}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Continuar</Text>
                )}
            </Pressable>
        </View>
    );
};

export default PermissionGate;
