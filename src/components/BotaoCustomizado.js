import React from 'react';
import { Pressable, Text } from 'react-native';
import {
    BotaoCustomizadoStyles,
    VARIANTES_FUNDO,
    VARIANTES_TEXTO,
} from './BotaoCustomizadoStyles';

const BotaoCustomizado = ({
    title,
    onPress,
    disabled,
    variant = 'primary',
}) => {
    const buttonStyle = {
        ...BotaoCustomizadoStyles.button,
        ...VARIANTES_FUNDO[variant],
    };

    const textStyle = {
        ...BotaoCustomizadoStyles.buttonText,
        ...VARIANTES_TEXTO[variant],
    };

    return (
        <Pressable
            style={({ pressed }) => [
                buttonStyle,
                pressed && { opacity: 0.75, transform: [{ scale: 0.98 }] },
                disabled && { opacity: 0.5 }
            ]}
            onPress={onPress}
            disabled={disabled}
            android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
        >
            <Text style={textStyle}>{title}</Text>
        </Pressable>
    );
};

export default BotaoCustomizado;