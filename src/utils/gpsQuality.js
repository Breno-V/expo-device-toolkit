import { ThemeColors } from '../theme/colors';

/**
 * RF02 — Classifica a precisão do sinal GPS.
 * Verde: alta precisão (< 10m) | Amarelo: média (10m–30m) | Vermelho: baixa (> 30m)
 */
export const gpsQuality = (accuracy) => {
    if (accuracy == null) {
        return { tier: 'desconhecida', color: ThemeColors.textDisabled, label: 'Precisão desconhecida' };
    }
    if (accuracy < 10) {
        return { tier: 'alta', color: ThemeColors.primary, label: 'Alta precisão' };
    }
    if (accuracy <= 30) {
        return { tier: 'media', color: ThemeColors.warning, label: 'Média precisão' };
    }
    return { tier: 'baixa', color: ThemeColors.alertRed, label: 'Baixa precisão' };
};