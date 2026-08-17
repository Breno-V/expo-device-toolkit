import React from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './PermissionGateStyles';

const PermissionGate = ({
    icon,
    title,
    description,
    status,
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
