import { useCallback, useEffect, useState } from 'react';

const resolveStatus = (response) => (response.granted ? 'granted' : 'denied');

export const usePermission = ({ getPermission, requestPermission }) => {
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const checkPermission = useCallback(async () => {
        const response = await getPermission();
        setStatus(resolveStatus(response));
    }, [getPermission]);

    const askPermission = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await requestPermission();
            setStatus(resolveStatus(response));
        } finally {
            setIsLoading(false);
        }
    }, [requestPermission]);

    useEffect(() => {
        checkPermission();
    }, [checkPermission]);

    return {
        status,
        isLoading,
        checkPermission,
        requestPermission: askPermission,
    };
};
