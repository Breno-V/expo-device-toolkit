import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, Alert } from 'react-native';
import * as Location from 'expo-location';
import { LocationStyles } from './LocationStyles';
import { usePermission } from '../../hooks/usePermission';
import PermissionGate from '../PermissionGate/PermissionGate';
import { gpsQuality } from '../../utils/gpsQuality';

const LocationComponent = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const { status, canAskAgain, isLoading, requestPermission } = usePermission({
        getPermission: Location.getForegroundPermissionsAsync,
        requestPermission: Location.requestForegroundPermissionsAsync,
    });

    const getCurrentLocation = async () => {
        if (status !== 'granted') return;
        setLoading(true);
        try {
            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            setLocation(currentLocation.coords);
        } catch (error) {
            console.error('Erro ao obter localização:', error);
            Alert.alert('Erro', 'Não foi possível obter a localização.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'granted') {
            getCurrentLocation();
        }
    }, [status]);

    return (
        <PermissionGate
            icon="map-pin"
            title="Acessar sua localização"
            description="Para exibir suas coordenadas GPS, precisamos da sua permissão para acessar a localização do dispositivo."
            status={status}
            canAskAgain={canAskAgain}
            loading={isLoading}
            onRequest={requestPermission}
        >
            <View style={LocationStyles.container}>
                {loading ? (
                    <View>
                        <ActivityIndicator size="large" color="#16A34A" />
                    </View>
                ) : (
                    <>
                        <Text style={LocationStyles.title}>Sua Localização Atual</Text>
                        {location ? (
                            <View>
                                <Text style={LocationStyles.infoLabel}>Latitude:</Text>
                                <Text style={LocationStyles.infoValue}>{location.latitude.toFixed(6)}</Text>
                                <Text style={LocationStyles.infoLabel}>Longitude:</Text>
                                <Text style={LocationStyles.infoValue}>{location.longitude.toFixed(6)}</Text>
                                <Text style={LocationStyles.infoLabel}>Altura:</Text>
                                <Text style={LocationStyles.infoValue}>{location.altitude?.toFixed(2) ?? '—'} m</Text>
                                <Text style={LocationStyles.infoLabel}>
                                    Precisão: ±{location.accuracy?.toFixed(2) ?? '—'} m
                                </Text>
                                {/* RF02 — indicador visual de precisão do sinal GPS */}
                                {(() => {
                                    const qualidade = gpsQuality(location.accuracy);
                                    return (
                                        <View style={LocationStyles.gpsMetaLinha}>
                                            <View
                                                style={[
                                                    LocationStyles.gpsPonto,
                                                    { backgroundColor: qualidade.color },
                                                ]}
                                            />
                                            <Text
                                                style={[
                                                    LocationStyles.gpsMetaTexto,
                                                    { color: qualidade.color },
                                                ]}
                                            >
                                                ±{location.accuracy?.toFixed(1) ?? '—'}m · {qualidade.label}
                                            </Text>
                                        </View>
                                    );
                                })()}
                            </View>
                        ) : (
                            <Text style={LocationStyles.errorText}>Pressione para obter a localização.</Text>
                        )}
                        <Pressable style={LocationStyles.button} onPress={getCurrentLocation}>
                            <Text style={LocationStyles.buttonText}>Atualizar Localização</Text>
                        </Pressable>
                    </>
                )}
            </View>
        </PermissionGate>
    );
};

export default LocationComponent;