import { useCallback, useEffect, useState } from 'react';
import { Linking, Alert } from 'react-native';

const resolveStatus = (response) => (response.granted ? 'granted' : 'denied');

export const usePermission = ({ getPermission, requestPermission }) => {
    const [status, setStatus] = useState(null);
    const [canAskAgain, setCanAskAgain] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const checkPermission = useCallback(async () => {
        const response = await getPermission();
        setStatus(resolveStatus(response));
        setCanAskAgain(response.canAskAgain);
    }, [getPermission]);

    const askPermission = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await requestPermission();
            setStatus(resolveStatus(response));
            setCanAskAgain(response.canAskAgain);

            if (!response.granted && !response.canAskAgain) {
                Alert.alert(
                    'Permissão necessária',
                    'Você bloqueou esta permissão. Para continuar, abra as configurações do sistema e ative manualmente.',
                    [
                        { text: 'Cancelar', style: 'cancel' },
                        { text: 'Abrir Configurações', onPress: () => Linking.openSettings() },
                    ]
                );
            }
        } finally {
            setIsLoading(false);
        }
    }, [requestPermission]);

    useEffect(() => {
        checkPermission();
    }, [checkPermission]);

    return {
        status,
        canAskAgain,
        isLoading,
        checkPermission,
        requestPermission: askPermission,
    };
};
