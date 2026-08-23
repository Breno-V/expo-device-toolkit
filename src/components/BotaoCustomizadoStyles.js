import { StyleSheet } from 'react-native';

export const BotaoCustomizadoStyles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    primaryBackground: {
        backgroundColor: '#16A34A',
    },
    secondaryBackground: {
        backgroundColor: '#DCFCE7',
        borderWidth: 1,
        borderColor: '#16A34A',
    },
    secondaryTextColor: {
        color: '#15803D',
    },
    dangerBackground: {
        backgroundColor: '#FFEBCC',
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    dangerTextColor: {
        color: '#FF3B30',
    },
});

// Fonte única das variantes — consumidas por BotaoCustomizado
export const VARIANTES_FUNDO = {
    primary: { backgroundColor: '#16A34A' },
    secondary: { backgroundColor: '#DCFCE7', borderWidth: 1, borderColor: '#16A34A' },
    danger: { backgroundColor: '#FFEBCC', borderWidth: 1, borderColor: '#FF3B30' },
    agroPrimary: { backgroundColor: '#14532D' },
    success: { backgroundColor: '#15803D' },
    warning: { backgroundColor: '#D97706' },
    satellite: { backgroundColor: '#15803D' },
};

export const VARIANTES_TEXTO = {
    primary: { color: '#fff' },
    secondary: { color: '#15803D' },
    danger: { color: '#FF3B30' },
    agroPrimary: { color: '#fff' },
    success: { color: '#fff' },
    warning: { color: '#fff' },
    satellite: { color: '#fff' },
};