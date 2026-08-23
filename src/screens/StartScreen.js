import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BotaoCustomizado from '../components/BotaoCustomizado';
import { globalStyles } from '../styles/globalStyles';
import { StartScreenStyles } from './StartScreenStyles';

const SECOES = [
    {
        icone: 'camera',
        titulo: 'Câmera e Galeria',
        botao: 'Acessar Galeria/Câmera',
        variante: 'secondary',
        rota: 'ImagePicker',
        dica: 'Selecione foto ou tire nova foto',
    },
    {
        icone: 'map-pin',
        titulo: 'Geolocalização',
        botao: 'Acessar Localização',
        variante: 'secondary',
        rota: 'Location',
        dica: 'Mostra coordenadas lat/long',
    },
    {
        icone: 'activity',
        titulo: 'Sensores (Acelerômetro/Giroscópio)',
        botao: 'Acessar Sensores',
        variante: 'secondary',
        rota: 'Sensors',
        dica: 'Leitura de 3 eixos XYZ',
    },
    {
        icone: 'users',
        titulo: 'Agenda Telefônica',
        botao: 'Acessar Contatos',
        variante: 'secondary',
        rota: 'Contacts',
        dica: 'Lista com paginação e busca',
    },
    {
        icone: 'archive',
        titulo: 'Histórico de Visitas',
        botao: 'Consultar Visitas Salvas',
        variante: 'secondary',
        rota: 'Historico',
        dica: 'Laudos assinados, disponíveis offline',
    },
    {
        icone: 'clipboard',
        titulo: 'Registro de Visita Técnica',
        botao: 'Abrir Registro de Visita',
        variante: 'primary',
        rota: 'RegistroVisita',
        dica: 'Auditoria com foto e geolocalização',
    },
];

const StartScreen = ({ navigation }) => {
    const navigateToScreen = (screenName) => {
        navigation.navigate(screenName);
    };

    return (
        <ScrollView
            style={globalStyles.scrollView}
            contentContainerStyle={globalStyles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={{ width: '100%', alignItems: 'center' }}>
                <Text style={globalStyles.titleText}>
                    Expo Device Toolkit
                </Text>
                <Text style={globalStyles.sectionTitle}>
                    Escolha um recurso para demonstrar
                </Text>

                {SECOES.map((secao) => (
                    <View key={secao.rota} style={StartScreenStyles.card}>
                        <View style={StartScreenStyles.cardIconeBox}>
                            <Feather name={secao.icone} size={26} color="#15803D" />
                        </View>
                        <Text style={globalStyles.sectionTitle}>
                            {secao.titulo}
                        </Text>
                        <BotaoCustomizado
                            title={secao.botao}
                            variant={secao.variante}
                            onPress={() => navigateToScreen(secao.rota)}
                        />
                        <Text style={StartScreenStyles.cardHint}>
                            {secao.dica}
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default StartScreen;