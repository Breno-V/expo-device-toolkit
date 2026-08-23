import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { listarVisitas } from '../storage/visitasStorage';
import { gpsQuality } from '../utils/gpsQuality';
import { HistoricoScreenStyles as styles } from './HistoricoScreenStyles';

const HistoricoScreen = () => {
    const [visitas, setVisitas] = useState([]);
    const [loading, setLoading] = useState(true);

    const carregar = useCallback(async () => {
        setLoading(true);
        const lista = await listarVisitas();
        setVisitas(lista);
        setLoading(false);
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    const formatarData = (iso) => {
        try {
            return new Date(iso).toLocaleString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
            });
        } catch {
            return iso;
        }
    };

    if (loading) {
        return (
            <View style={styles.centro}>
                <ActivityIndicator size="large" color="#16A34A" />
            </View>
        );
    }

    if (visitas.length === 0) {
        return (
            <View style={styles.centro}>
                <Feather name="archive" size={44} color="#86EFAC" />
                <Text style={styles.vazioTitulo}>Nenhuma visita registrada</Text>
                <Text style={styles.vazioTexto}>
                    Conclua uma auditoria em "Registro de Visita Técnica" e ela aparecerá aqui — mesmo offline.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.conteudo}
            showsVerticalScrollIndicator={false}
        >
            {visitas.map((item) => {
                const qualidade = gpsQuality(item.coords?.accuracy);
                return (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.linhaTopo}>
                            {item.fotoUri ? (
                                <Image source={{ uri: item.fotoUri }} style={styles.thumb} />
                            ) : (
                                <View style={[styles.thumb, styles.thumbVazia]}>
                                    <Feather name="image" size={20} color="#94A3B8" />
                                </View>
                            )}
                            <View style={{ flex: 1 }}>
                                <Text style={styles.produtor} numberOfLines={1}>
                                    {item.nomeProdutor || 'Produtor não informado'}
                                </Text>
                                <Text style={styles.safra} numberOfLines={1}>
                                    🌾 {item.nomeSafra || 'Safra não informada'}
                                </Text>
                                <Text style={styles.data}>🗓 {formatarData(item.criadoEm)}</Text>
                            </View>
                        </View>

                        <View style={styles.rodapeCard}>
                            {/* RF02 — badge de precisão do GPS no histórico */}
                            <View style={styles.badgeLinha}>
                                <View style={[styles.ponto, { backgroundColor: qualidade.color }]} />
                                <Text style={[styles.badgeTexto, { color: qualidade.color }]}>
                                    GPS: {qualidade.label}
                                    {item.coords?.accuracy != null ? ` (±${item.coords.accuracy.toFixed(1)}m)` : ''}
                                </Text>
                            </View>
                            {item.areaHectare ? (
                                <Text style={styles.area}>📏 {item.areaHectare} ha</Text>
                            ) : null}
                        </View>

                        {item.descricao ? (
                            <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text>
                        ) : null}
                    </View>
                );
            })}
        </ScrollView>
    );
};

export default HistoricoScreen;