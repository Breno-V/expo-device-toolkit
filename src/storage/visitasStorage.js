import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const STORAGE_KEY = '@visitas_tecnicas';
const FOTOS_DIR = `${FileSystem.documentDirectory}visitas`;

const garantirDiretorioFotos = async () => {
    const info = await FileSystem.getInfoAsync(FOTOS_DIR);
    if (!info.exists) {
        await FileSystem.makeDirectoryAsync(FOTOS_DIR, { intermediates: true });
    }
    return FOTOS_DIR;
};

// Copia a foto do cache para armazenamento durável (sobrevive a reinícios)
export const persistirFoto = async (uriOrigem) => {
    try {
        if (!uriOrigem) return null;
        const dir = await garantirDiretorioFotos();
        const extensao = uriOrigem.split('.').pop()?.split('?')[0] || 'jpg';
        const destino = `${dir}/visita_${Date.now()}.${extensao}`;
        await FileSystem.copyAsync({ from: uriOrigem, to: destino });
        return destino;
    } catch (e) {
        console.warn('Falha ao persistir foto, mantendo URI original:', e);
        return uriOrigem;
    }
};

export const salvarVisita = async (visita) => {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        const lista = json ? JSON.parse(json) : [];
        lista.unshift(visita);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
        return true;
    } catch (e) {
        console.error('Erro ao salvar visita:', e);
        return false;
    }
};

export const listarVisitas = async () => {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        console.error('Erro ao carregar visitas:', e);
        return [];
    }
};

export const limparVisitas = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (e) {
        console.error('Erro ao limpar visitas:', e);
        return false;
    }
};