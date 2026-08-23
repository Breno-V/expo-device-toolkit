import { StyleSheet } from 'react-native';

export const SensorStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#555',
    },
    axisRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    axisCol: {
        alignItems: 'center',
        flexShrink: 1,
        minWidth: 0,
    },
    controlesTitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    cardAviso: {
        borderLeftWidth: 4,
        borderLeftColor: '#D97706',
    },
    cardAvisoTexto: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 4,
    },
    card: {
        padding: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        marginBottom: 12,
    },
    axisLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    axisValue: {
        fontSize: 18,
        color: '#000',
        fontFamily: 'monospace',
    },
    magnitudeText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    magnitudeValue: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    alertInstability: {
        color: '#FF3B30',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
        textAlign: 'center',
    },
    controlButton: {
        padding: 12,
        backgroundColor: '#16A34A',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    controlButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    resetButton: {
        padding: 12,
        backgroundColor: '#DCFCE7',
        borderWidth: 1,
        borderColor: '#16A34A',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    resetButtonText: {
        color: '#15803D',
        fontSize: 16,
        fontWeight: '600',
    },
    statusText: {
        fontSize: 14,
        color: '#16A34A',
        marginTop: 8,
    },
    redStatusText: {
        color: '#FF3B30',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
    },
});