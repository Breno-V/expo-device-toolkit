# Expo Device Toolkit — Aplicativo que acessa os principais sensores do dispositivo

Aplicativo de **Registro de Visitas Técnicas Agrícolas**, onde o produtor registra a vistoria da safra no campo com foto, GPS, telemetria de movimento e laudo final, funcionando mesmo offline.

## Objetivo

Demonstrar o acesso aos principais recursos de hardware via Expo, integrados em um fluxo real de auditoria agrícola, já que cada visita precisa de evidência fotográfica, georreferenciamento do lote, estabilidade do aparelho na hora de assinar e consulta posterior sem internet, por isso o app divide-se em 6 módulos que depois se juntam no Registro de Visita.

## Estrutura do Projeto

```text
expo-device-toolkit/
├── App.js                        # Navegação Stack (Start, ImagePicker, Contacts, Location, Sensors, RegistroVisita, Historico)
├── app.json                      # Permissões Android + configs Expo
└── src/
    ├── screens/                  # StartScreen, RegistroVisitaScreen, HistoricoScreen
    ├── components/
    │   ├── ImagePicker/          # Câmera e galeria
    │   ├── Location/             # GPS + indicador RF02
    │   ├── Sensors/              # Acelerômetro / Giroscópio
    │   ├── Contacts/             # Agenda paginada
    │   ├── PermissionGate/       # Tela de bloqueado + Abrir Configurações
    │   └── BotaoCustomizado.js
    ├── hooks/usePermission.js    # Centraliza get/request + canAskAgain
    ├── storage/visitasStorage.js # AsyncStorage + FileSystem (RF01)
    ├── utils/gpsQuality.js       # Verde <10m / Amarelo 10-30m / Vermelho >30m (RF02)
    ├── theme/colors.js           # Paleta verde campo
    └── styles/globalStyles.js    # Base responsiva (RNF02)
```

## Tecnologias

<div>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="100" height="100" alt="React Native" title="React Native" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="100" height="100" alt="JavaScript" title="JavaScript" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg" width="100" height="100" alt="Android" title="Android" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="100" height="100" alt="Node.js" title="Node.js" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" width="100" height="100" alt="npm" title="npm" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="100" height="100" alt="Git" title="Git" />
</div>

#### Pacotes Expo sem ícone no DEVICON, mas centrais no projeto:

| Pacote | Para que serve |
| ------ | -------------- |
| `expo-image-picker` | Câmera e galeria, com pedido de permissão |
| `expo-location` | Latitude, longitude, altitude e precisão do GPS |
| `expo-sensors` | Acelerômetro e giroscópio para telemetria |
| `expo-contacts/legacy` | Agenda telefônica com paginação nativa |
| `expo-file-system` | Cópia permanente da foto da visita |
| `@react-native-async-storage/async-storage` | Histórico local offline |
| `@react-navigation/native-stack` | Navegação entre telas |

## Resolução dos problemas (como resolvi os principais desafios)

**1. Câmera e galeria — permissão negada (Nível Júnior).**
Usei o `expo-image-picker`, onde a função principal primeiro pede a permissão e depois já abre a câmera ou a galeria, só que quando o usuário negava com "não perguntar novamente" o app ficava preso num alerta genérico, então agora quando o sistema avisa que não dá mais para perguntar (`canAskAgain: false`), mostro a tela de bloqueado do `PermissionGate` com botão de Abrir Configurações, que leva direto às configurações do Android.

**2. Geolocalização + feedback visual (RF02).**
Usei o `expo-location`, cuja função principal pega latitude, longitude e precisão, só que número puro não diz nada no campo, por isso criei o `gpsQuality()`, que transforma a precisão em semáforo: verde até 10m (alta), amarelo de 10 a 30m (média) e vermelho acima de 30m (baixa), exibido tanto na tela de Localização quanto no Registro e no Histórico.

**3. Sensores — trava por movimento (Nível Pleno).**
Usei o `expo-sensors`, onde diferente da câmera aqui não há pedido de permissão por ser sensor de baixo risco, então a função principal já fica ouvindo o acelerômetro e junta os 3 eixos para calcular a força em "g", ao passo que o giroscópio completa com a rotação, de modo que se passar de 2.0g o app marca Instabilidade Física Detectada e bloqueia o botão de finalizar até estabilizar.

**4. Agenda telefônica em massa (Nível Sênior).**
Usei o `expo-contacts` com `FlatList`, cuja função principal evita carregar tudo de uma vez, pois traz de 20 em 20 (`pageSize` + `pageOffset`) conforme rola, enquanto o buscar já filtra na consulta nativa com debounce, e é por isso que suporta 5 mil+ contatos sem lag nem estouro de memória.

**5. Histórico local offline (RF01).**
Usei `AsyncStorage` com `expo-file-system`, de maneira que a função principal salva o laudo com foto, GPS e dados em `@visitas_tecnicas` e copia a foto do cache para pasta permanente, para depois listar tudo na `HistoricoScreen` mesmo sem internet.

**6. Integração no Registro de Visita Técnica.**
É onde tudo se junta, pois o produtor preenche os dados, depois captura o GPS já com selo de cor, em seguida tira a foto com prova de local e hora, enquanto acompanha a telemetria ao vivo, de forma que só finaliza com foto e aparelho estável, além de não quebrar sem GPS ou câmera (degradação graciosa RNF01) e se adaptar a qualquer tela em pé ou deitado com `ScrollView`, `flex` e `flexWrap` (RNF02).
## Vídeo demonstrativo

https://github.com/Breno-V/expo-device-toolkit/raw/main/assets/apresentacao-pam-05-09-26.mp4

<video src="https://github.com/Breno-V/expo-device-toolkit/raw/main/assets/apresentacao-pam-05-09-26.mp4" width="360" controls playsinline preload="metadata"></video>

> Se o player não carregar, [clique aqui para assistir ao vídeo](./assets/apresentacao-pam-05-09-26.mp4).

## Como executar o projeto

Pré-requisitos: Node 18+, npm, Expo Go no Android, e GPS/câmera liberados no aparelho.

```bash
# 0. Clonar repositório na sua máquina
git clone https://github.com/Breno-V/expo-device-toolkit
```

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em modo desenvolvimento
npx expo start #Use --tunnel caso não esteja na mesma internet

# 3. Abrir no celular
# - Escaneie o QR Code com o Expo Go, ou utilize o sistema no celular nativo:
npx expo run:android
```

Permissões Android já declaradas em `app.json`: `CAMERA`, `READ_CONTACTS`, `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, além de descrições de uso no iOS.

Dicas de teste:

- Câmera: negue 2x para ver a tela de "Permissão Bloqueada".
- GPS: teste ao ar livre para pegar verde/amarelo; indoor costuma dar vermelho, o que também valida o RF02.
- Sensores: balance o celular para estourar 2.0g e ver o bloqueio.
- Contatos: role até o fim para ver o infinito e digite no buscar.
- Histórico: finalize uma visita e feche/abra o app offline para confirmar a persistência.
