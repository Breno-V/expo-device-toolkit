import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Pressable, ScrollView } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { SensorStyles } from './SensorStyles';

const SensorComponent = () => {
    const [accelerometer, setAccelerometer] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [gyroscope, setGyroscope] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [instabilidadeDetectada, setInstabilidadeDetectada] = useState(false);
    // RNF01 — estado de disponibilidade do hardware
    const [accelDisponivel, setAccelDisponivel] = useState(true);
    const [gyroDisponivel, setGyroDisponivel] = useState(true);

    useEffect(() => {
        let subAccel = null;
        let subGyro = null;

        (async () => {
            try {
                const accelOk = await Accelerometer.isAvailableAsync();
                setAccelDisponivel(accelOk);
                if (accelOk) {
                    Accelerometer.setUpdateInterval(200);
                    subAccel = Accelerometer.addListener(({ x, y, z }) => {
                        setAccelerometer({ x, y, z });
                        const magnitude = Math.sqrt(x * x + y * y + z * z);
                        if (magnitude > 2.0) {
                            setInstabilidadeDetectada(true);
                        }
                    });
                }

                const gyroOk = await Gyroscope.isAvailableAsync();
                setGyroDisponivel(gyroOk);
                if (gyroOk) {
                    Gyroscope.setUpdateInterval(200);
                    subGyro = Gyroscope.addListener(({ x, y, z }) => {
                        setGyroscope({ x, y, z });
                    });
                }
            } catch (e) {
                console.log('Sensores indisponíveis:', e);
                setAccelDisponivel(false);
                setGyroDisponivel(false);
            }
        })();

        return () => {
            subAccel && subAccel.remove();
            subGyro && subGyro.remove();
        };
    }, []);

    const verificarInstabilidade = () => {
        const { x, y, z } = accelerometer;
        const magnitude = Math.sqrt(x * x + y * y + z * z);

        if (magnitude > 2.0) {
            setInstabilidadeDetectada(true);
            Alert.alert(
                'Instabilidade Física Detectada',
                `Aceleração vetorial detectada: ${magnitude.toFixed(2)}g (limite: 2.0g)`
            );
        } else {
            Alert.alert(
                'Estável',
                `Nenhuma instabilidade detectada. Magnitude atual: ${magnitude.toFixed(2)}g (limite: 2.0g)`
            );
        }
    };

    const resetarInstabilidade = () => {
        if (!instabilidadeDetectada) {
            Alert.alert('Info', 'Nenhum alerta ativo para resetar.');
            return;
        }
        setInstabilidadeDetectada(false);
        Alert.alert('Resetado', 'Alerta de instabilidade foi limpo.');
    };

    const renderLinhaEixos = (dados, sufixo) => (
        <View style={SensorStyles.axisRow}>
            {['x', 'y', 'z'].map((eixo) => (
                <View key={eixo} style={SensorStyles.axisCol}>
                    <Text style={SensorStyles.axisLabel}>{eixo.toUpperCase()}:</Text>
                    <Text
                        style={SensorStyles.axisValue}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        {dados[eixo].toFixed(2)}{sufixo}
                    </Text>
                </View>
            ))}
        </View>
    );

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}
            contentContainerStyle={{ paddingBottom: 24, justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
        >
            <Text style={SensorStyles.title}>Sensores de Movimento</Text>

            {/* RNF01 — aviso amigável quando o hardware não existe */}
            {!accelDisponivel && (
                <View style={[SensorStyles.card, SensorStyles.cardAviso]}>
                    <Text style={SensorStyles.alertInstability}>Acelerômetro indisponível neste aparelho.</Text>
                    <Text style={SensorStyles.cardAvisoTexto}>
                        As leituras abaixo ficarão zeradas. A trava de instabilidade da auditoria permanece desativada com segurança.
                    </Text>
                </View>
            )}
            {!gyroDisponivel && (
                <View style={[SensorStyles.card, SensorStyles.cardAviso]}>
                    <Text style={SensorStyles.cardAvisoTexto}>
                        Giroscópio indisponível neste aparelho.
                    </Text>
                </View>
            )}

            {/* Acelerômetro */}
            <View style={SensorStyles.card}>
                <Text style={SensorStyles.sectionTitle}>Acelerômetro (3 eixos)</Text>
                {renderLinhaEixos(accelerometer, 'g')}
                <Text style={SensorStyles.magnitudeText}>
                    Magnitude: <Text style={SensorStyles.magnitudeValue}>
                        {Math.sqrt(
                            accelerometer.x ** 2 +
                            accelerometer.y ** 2 +
                            accelerometer.z ** 2
                        ).toFixed(2)}g
                    </Text>
                </Text>
                {instabilidadeDetectada && (
                    <Text style={SensorStyles.alertInstability}>⚠️ Instabilidade Física Detectada!</Text>
                )}
            </View>

            {/* Giroscópio */}
            <View style={SensorStyles.card}>
                <Text style={SensorStyles.sectionTitle}>Giroscópio (3 eixos)</Text>
                {renderLinhaEixos(gyroscope, ' rad/s')}
            </View>

            {/* Controles */}
            <View>
                <Text style={SensorStyles.controlesTitulo}>Verificar Instabilidade</Text>
                <Pressable
                    style={({ pressed }) => [
                        SensorStyles.controlButton,
                        instabilidadeDetectada && { backgroundColor: '#FF3B30' },
                        pressed && { opacity: 0.7 },
                    ]}
                    onPress={verificarInstabilidade}
                    android_ripple={{ color: '#ffffff33' }}
                >
                    <Text style={SensorStyles.controlButtonText}>
                        {instabilidadeDetectada ? 'Instabilidade Já Detectada' : 'Verificar Aceleração'}
                    </Text>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        SensorStyles.resetButton,
                        pressed && { opacity: 0.7, backgroundColor: '#DCFCE7' },
                    ]}
                    onPress={resetarInstabilidade}
                    android_ripple={{ color: '#16A34A33' }}
                >
                    <Text style={SensorStyles.resetButtonText}>Resetar Alerta</Text>
                </Pressable>
                {instabilidadeDetectada && (
                    <Text style={SensorStyles.redStatusText}>⚠️ Instabilidade em memória</Text>
                )}
                {!instabilidadeDetectada && (
                    <Text style={SensorStyles.statusText}>✓ Nenhuma instabilidade detectada</Text>
                )}
            </View>
        </ScrollView>
    );
};

export default SensorComponent;