import { StyleSheet } from 'react-native';

export const LocationStyles = StyleSheet.create({
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
    infoLabel: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },
    button: {
        padding: 12,
        backgroundColor: '#16A34A',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
});