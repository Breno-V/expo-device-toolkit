import React, { useState, useEffect } from 'react';
import {
    View, Text, Image, Alert, TextInput,
    ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { usePermission } from '../hooks/usePermission';
import BotaoCustomizado from '../components/BotaoCustomizado';
import { globalStyles } from '../styles/globalStyles';
import { RegistroVisitaScreenStyles } from './RegistroVisitaScreenStyles';
import { salvarVisita, persistirFoto } from '../storage/visitasStorage';
import { gpsQuality } from '../utils/gpsQuality';

const RegistroVisitaScreen = () => {
    const [fotoUri, setFotoUri] = useState(null);
    const [dadosVisita, setDadosVisita] = useState({
        nomeProdutor: '',
        nomeSafra: '',
        areaHectare: '',
        descricao: ''
    });
    const [assinaturaValidada, setAssinaturaValidada] = useState(false);
    const [fisicaInstavel, setFisicaInstavel] = useState(false);
    const [vectorMagnitude, setVectorMagnitude] = useState(1.0);
    const [coords, setCoords] = useState(null);
    const [fotoTimestamp, setFotoTimestamp] = useState(null);
    const [gpsErro, setGpsErro] = useState(null);
    const [salvando, setSalvando] = useState(false);

    // Níveis de estabilidade do acelerômetro (barra de telemetria)
    const tier = vectorMagnitude > 2.0 ? 'alerta' : vectorMagnitude > 1.5 ? 'atencao' : 'ok';
    const tierColor = tier === 'alerta' ? '#EF4444' : tier === 'atencao' ? '#D97706' : '#22C55E';
    const tierLabel = tier === 'alerta' ? '⚠ ALERTA >2.0G' : tier === 'atencao' ? '~ MOVIMENTAÇÃO' : '✓ ESTÁVEL';

    // Permissões
    const { status: cameraStatus, requestPermission: requestCamera } = usePermission({
        getPermission: ImagePicker.getCameraPermissionsAsync,
        requestPermission: ImagePicker.requestCameraPermissionsAsync,
    });

    const { status: locationStatus, requestPermission: requestLocation } = usePermission({
        getPermission: Location.getForegroundPermissionsAsync,
        requestPermission: Location.requestForegroundPermissionsAsync,
    });

    // Captura de GPS automatizada ao abrir se permitido (RNF01 — degradação graciosa)
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.getForegroundPermissionsAsync();
                if (status !== 'granted') return;

                const servicoAtivo = await Location.hasServicesEnabledAsync();
                if (!servicoAtivo) {
                    setGpsErro('GPS desligado. Ative a localização nos ajustes do sistema.');
                    return;
                }

                const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                setCoords(loc.coords);
                setGpsErro(null);
            } catch (e) {
                console.log('GPS inicial indisponível:', e);
                setGpsErro('Sem sinal de GPS agora. Toque em "Capturar Coordenadas GPS" ao ar livre.');
            }
        })();
    }, []);

    // Sensor accelerometer monitoring (Pleno >2.0g)
    useEffect(() => {
        Accelerometer.setUpdateInterval(200);
        const sub = Accelerometer.addListener(({ x, y, z }) => {
            const magnitude = Math.sqrt(x * x + y * y + z * z);
            setVectorMagnitude(magnitude);

            if (magnitude > 2.0 && !fisicaInstavel) {
                setFisicaInstavel(true);
                Alert.alert(
                    '⚠️ Instabilidade Física Detectada',
                    `Aceleração vetorial: ${magnitude.toFixed(2)}g (limite: 2.0g). Estabilize o aparelho!`
                );
            }
        });
        return () => sub && sub.remove();
    }, [fisicaInstavel]);

    const capturarFoto = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
        });

        if (result.canceled) return;
        setFotoUri(result.assets[0].uri);
        setFotoTimestamp(new Date());
    };

    const capturarNovaFoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão Negada', 'Precisamos da câmera para capturar evidência.');
            return;
        }

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.8,
            });

            if (result.canceled) return;
            setFotoUri(result.assets[0].uri);
            setFotoTimestamp(new Date());
        } catch (e) {
            // RNF01 — aparelho sem câmera ou falha de hardware
            console.log('Câmera indisponível:', e);
            Alert.alert('Câmera indisponível', 'Este dispositivo não possui câmera ativa. Use a galeria para anexar a evidência.');
        }
    };

    const obterLocalizacaoGPS = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão Negada', 'Precisamos do GPS para georreferenciar o lote.');
            return;
        }
        try {
            const servicoAtivo = await Location.hasServicesEnabledAsync();
            if (!servicoAtivo) {
                setGpsErro('GPS desligado. Ative a localização nos ajustes do sistema.');
                Alert.alert('GPS desligado', 'Ative a localização nos ajustes do sistema e tente novamente.');
                return;
            }
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
            setCoords(loc.coords);
            setGpsErro(null);
            Alert.alert('GPS Capturado', `Lat: ${loc.coords.latitude.toFixed(6)}, Long: ${loc.coords.longitude.toFixed(6)}`);
        } catch (e) {
            console.log('Falha GPS:', e);
            setGpsErro('Sem sinal de GPS agora. Tente em área aberta.');
            Alert.alert('Erro', 'Não foi possível obter sinal de GPS.');
        }
    };

    const finalizarAuditoria = async () => {
        if (!fotoUri) {
            Alert.alert('Atenção', 'É obrigatório anexar uma evidência fotográfica.');
            return;
        }
        if (fisicaInstavel) {
            Alert.alert('Atenção', 'Instabilidade física detectada nos sensores. Estabilize o dispositivo.');
            return;
        }

        setSalvando(true);
        try {
            // RF01 — copia a foto p/ armazenamento durável e grava o registro local
            const fotoPersistente = await persistirFoto(fotoUri);
            const qualidade = gpsQuality(coords?.accuracy);
            const registro = {
                id: `visita_${Date.now()}`,
                ...dadosVisita,
                coords,
                gpsTier: qualidade.tier,
                fotoUri: fotoPersistente,
                criadoEm: new Date().toISOString(),
            };
            const ok = await salvarVisita(registro);

            setAssinaturaValidada(true);
            if (!ok) {
                Alert.alert('Atenção', 'Laudo assinado, mas houve falha ao salvar no histórico local.');
            }
        } catch (e) {
            console.error('Falha ao finalizar auditoria:', e);
            Alert.alert('Erro', 'Não foi possível concluir a auditoria. Tente novamente.');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <ScrollView
            style={globalStyles.scrollView}
            contentContainerStyle={globalStyles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={{ width: '100%', paddingVertical: 16 }}>
                
                {/* 🌿 Header Card AgroTech */}
                <View style={RegistroVisitaScreenStyles.headerCard}>
                    <Text style={RegistroVisitaScreenStyles.headerSubtitle}>Módulo de Campo & Telemetria</Text>
                    <Text style={RegistroVisitaScreenStyles.headerTitle}>Auditoria de Safra & Vistoria</Text>
                    
                    <View style={RegistroVisitaScreenStyles.badgeContainer}>
                        <View style={[
                            RegistroVisitaScreenStyles.badgeDot, 
                            { backgroundColor: fisicaInstavel ? '#DC2626' : '#4ADE80' }
                        ]} />
                        <Text style={RegistroVisitaScreenStyles.badgeText}>
                            {fisicaInstavel ? 'Alerta: Instabilidade > 2.0g' : `Sensor Estável (${vectorMagnitude.toFixed(2)}g)`}
                        </Text>
                    </View>
                </View>

                {/* 📝 Card 1: Dados do Produtor */}
                <View style={RegistroVisitaScreenStyles.sectionCard}>
                    <View style={RegistroVisitaScreenStyles.sectionHeaderRow}>
                        <View style={RegistroVisitaScreenStyles.sectionIconBox}>
                            <Feather name="user" size={18} color="#15803D" />
                        </View>
                        <Text style={RegistroVisitaScreenStyles.sectionTitle}>Identificação da Propriedade</Text>
                    </View>

                    <TextInput
                        style={RegistroVisitaScreenStyles.input}
                        placeholder="Nome do Produtor Rural"
                        placeholderTextColor="#94A3B8"
                        value={dadosVisita.nomeProdutor}
                        onChangeText={txt => setDadosVisita({ ...dadosVisita, nomeProdutor: txt })}
                        autoCapitalize="words"
                    />
                    <TextInput
                        style={RegistroVisitaScreenStyles.input}
                        placeholder="Safra / Cultura (ex: Soja 2026/Stage 2)"
                        placeholderTextColor="#94A3B8"
                        value={dadosVisita.nomeSafra}
                        onChangeText={txt => setDadosVisita({ ...dadosVisita, nomeSafra: txt })}
                    />
                    <TextInput
                        style={RegistroVisitaScreenStyles.input}
                        placeholder="Área Estimada (Hectares)"
                        placeholderTextColor="#94A3B8"
                        keyboardType="numeric"
                        value={dadosVisita.areaHectare}
                        onChangeText={txt => setDadosVisita({ ...dadosVisita, areaHectare: txt })}
                    />
                    <TextInput
                        style={[RegistroVisitaScreenStyles.input, RegistroVisitaScreenStyles.textArea]}
                        placeholder="Observações técnicas de campo..."
                        placeholderTextColor="#94A3B8"
                        multiline={true}
                        numberOfLines={3}
                        value={dadosVisita.descricao}
                        onChangeText={txt => setDadosVisita({ ...dadosVisita, descricao: txt })}
                    />
                </View>

                {/* 📍 Card 2: Geolocalização */}
                <View style={RegistroVisitaScreenStyles.sectionCard}>
                    <View style={RegistroVisitaScreenStyles.sectionHeaderRow}>
                        <View style={RegistroVisitaScreenStyles.sectionIconBox}>
                            <Feather name="map-pin" size={18} color="#15803D" />
                        </View>
                        <Text style={RegistroVisitaScreenStyles.sectionTitle}>Georreferenciamento de Lote</Text>
                    </View>

                    {coords ? (
                        <View style={{ marginBottom: 12 }}>
                            <Text style={RegistroVisitaScreenStyles.gpsCoords}>
                                🌐 Lat: {coords.latitude.toFixed(6)} | Long: {coords.longitude.toFixed(6)}
                            </Text>
                            {/* RF02 — indicador visual de precisão do sinal GPS */}
                            <View style={RegistroVisitaScreenStyles.gpsMetaLinha}>
                                <View style={[
                                    RegistroVisitaScreenStyles.gpsPonto,
                                    { backgroundColor: gpsQuality(coords.accuracy).color },
                                ]} />
                                <Text style={RegistroVisitaScreenStyles.gpsMetaTexto}>
                                    🎯 ±{coords.accuracy?.toFixed(1) ?? '—'}m · {gpsQuality(coords.accuracy).label}
                                </Text>
                            </View>
                        </View>
                    ) : gpsErro ? (
                        <View style={RegistroVisitaScreenStyles.avisoBanner}>
                            <Text style={RegistroVisitaScreenStyles.avisoTexto}>📍 {gpsErro}</Text>
                        </View>
                    ) : (
                        <Text style={RegistroVisitaScreenStyles.gpsMetaTexto}>
                            Nenhuma coordenada capturada ainda.
                        </Text>
                    )}

                    <BotaoCustomizado
                        title="Capturar Coordenadas GPS"
                        variant="satellite"
                        onPress={obterLocalizacaoGPS}
                    />
                </View>

                {/* 📸 Card 3: Evidência Fotográfica */}
                <View style={RegistroVisitaScreenStyles.sectionCard}>
                    <View style={RegistroVisitaScreenStyles.sectionHeaderRow}>
                        <View style={RegistroVisitaScreenStyles.sectionIconBox}>
                            <Feather name="camera" size={18} color="#15803D" />
                        </View>
                        <Text style={RegistroVisitaScreenStyles.sectionTitle}>Comprovação Fotográfica</Text>
                    </View>

                    <View style={RegistroVisitaScreenStyles.imagePreviewContainer}>
                        {fotoUri ? (
                            <>
                                <Image
                                    source={{ uri: fotoUri }}
                                    style={RegistroVisitaScreenStyles.imagePreview}
                                />
                                <View style={RegistroVisitaScreenStyles.photoTagOverlay} pointerEvents="none">
                                    <Text style={RegistroVisitaScreenStyles.photoTagText}>
                                        {coords
                                            ? `GPS ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`
                                            : 'GPS não capturado'}
                                        {' · '}
                                        {fotoTimestamp
                                            ? fotoTimestamp.toLocaleTimeString('pt-BR')
                                            : '--:--:--'}
                                    </Text>
                                </View>
                            </>
                        ) : (
                            <View style={RegistroVisitaScreenStyles.fotoVaziaBox}>
                                <Feather name="image" size={32} color="#94A3B8" />
                                <Text style={[RegistroVisitaScreenStyles.emptyText, { marginTop: 6 }]}>
                                    Nenhuma evidência capturada
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={RegistroVisitaScreenStyles.fotoBotoesLinha}>
                        <View style={RegistroVisitaScreenStyles.fotoBotaoItem}>
                            <BotaoCustomizado
                                title="Tirar Foto"
                                variant="agroPrimary"
                                onPress={capturarNovaFoto}
                            />
                        </View>
                        <View style={RegistroVisitaScreenStyles.fotoBotaoItem}>
                            <BotaoCustomizado
                                title="Galeria"
                                variant="secondary"
                                onPress={capturarFoto}
                            />
                        </View>
                    </View>
                </View>

                {/* 📊 Card 4: Telemetria & Permissões */}
                <View style={RegistroVisitaScreenStyles.sectionCard}>
                    <View style={RegistroVisitaScreenStyles.sectionHeaderRow}>
                        <View style={RegistroVisitaScreenStyles.sectionIconBox}>
                            <Feather name="shield" size={18} color="#15803D" />
                        </View>
                        <Text style={RegistroVisitaScreenStyles.sectionTitle}>Auditoria de Sensores & Permissões</Text>
                    </View>

                    <View style={RegistroVisitaScreenStyles.telemetryBox}>
                        <Text style={RegistroVisitaScreenStyles.telemetryTitle}>Telemetria do Acelerômetro</Text>
                        <View style={RegistroVisitaScreenStyles.telemetryRow}>
                            <Text style={RegistroVisitaScreenStyles.telemetryText}>
                                Mag: {vectorMagnitude.toFixed(2)}g · Limite 2.00g
                            </Text>
                            <Text style={[RegistroVisitaScreenStyles.telemetryText, { color: tierColor }]}>
                                {tierLabel}
                            </Text>
                        </View>
                        <View style={RegistroVisitaScreenStyles.telemetryBarTrack}>
                            <View
                                style={[
                                    RegistroVisitaScreenStyles.telemetryBarFill,
                                    {
                                        width: `${Math.min((vectorMagnitude / 3) * 100, 100)}%`,
                                        backgroundColor: tierColor,
                                    },
                                ]}
                            />
                        </View>
                    </View>

                    <View style={RegistroVisitaScreenStyles.permissionRow}>
                        <Text style={RegistroVisitaScreenStyles.permissionLabel}>Câmera:</Text>
                        <Text style={cameraStatus === 'granted' ? RegistroVisitaScreenStyles.statusGranted : RegistroVisitaScreenStyles.statusPending}>
                            {cameraStatus === 'granted' ? 'Concedida' : 'Pendente'}
                        </Text>
                    </View>

                    <View style={RegistroVisitaScreenStyles.permissionRow}>
                        <Text style={RegistroVisitaScreenStyles.permissionLabel}>Geolocalização:</Text>
                        <Text style={locationStatus === 'granted' ? RegistroVisitaScreenStyles.statusGranted : RegistroVisitaScreenStyles.statusPending}>
                            {locationStatus === 'granted' ? 'Concedida' : 'Pendente'}
                        </Text>
                    </View>
                </View>

                {/* 🛡️ Ação Final: Finalizar Auditoria */}
                <View style={{ marginTop: 10, marginBottom: 30 }}>
                    <BotaoCustomizado
                        title={salvando ? 'Assinando laudo...' : 'Finalizar e Assinar Laudo Técnico'}
                        variant="agroPrimary"
                        disabled={!fotoUri || fisicaInstavel || salvando}
                        onPress={finalizarAuditoria}
                    />
                </View>

                {/* Resultado */}
                {assinaturaValidada && (
                    <View style={[RegistroVisitaScreenStyles.sectionCard, RegistroVisitaScreenStyles.sucessoCard]}>
                        <View style={RegistroVisitaScreenStyles.sucessoCabecalho}>
                            <Feather name="check-circle" size={20} color="#16A34A" style={{ marginRight: 8 }} />
                            <Text style={RegistroVisitaScreenStyles.sucessoTitulo}>
                                Laudo Sincronizado com Sucesso!
                            </Text>
                        </View>
                        <Text style={RegistroVisitaScreenStyles.sucessoDados}>
                            {JSON.stringify(dadosVisita, null, 2)}
                        </Text>
                    </View>
                )}

            </View>
        </ScrollView>
    );
};

export default RegistroVisitaScreen;