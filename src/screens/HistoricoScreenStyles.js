import { StyleSheet } from 'react-native';

export const HistoricoScreenStyles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    conteudo: {
        padding: 16,
    },
    centro: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#fff',
    },
    vazioTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#14532D',
        marginTop: 12,
    },
    vazioTexto: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 14,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    linhaTopo: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    thumb: {
        width: 64,
        height: 64,
        borderRadius: 10,
        backgroundColor: '#F0FDF4',
    },
    thumbVazia: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    produtor: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    safra: {
        fontSize: 13,
        color: '#15803D',
        marginTop: 2,
    },
    data: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    rodapeCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        flexWrap: 'wrap',
        gap: 8,
    },
    badgeLinha: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ponto: {
        width: 9,
        height: 9,
        borderRadius: 5,
        marginRight: 5,
    },
    badgeTexto: {
        fontSize: 12,
        fontWeight: '600',
    },
    area: {
        fontSize: 12,
        color: '#475569',
    },
    descricao: {
        fontSize: 13,
        color: '#374151',
        marginTop: 8,
        lineHeight: 18,
    },
});