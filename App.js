import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ImagePickerComponent from './src/components/ImagePicker/ImagePickerComponent';
import ContactsComponent from './src/components/Contacts/ContactsComponent';
import LocationComponent from './src/components/Location/LocationComponent';
import SensorComponent from './src/components/Sensors/SensorComponent';
import RegistroVisitaScreen from './src/screens/RegistroVisitaScreen';
import StartScreen from './src/screens/StartScreen';
import HistoricoScreen from './src/screens/HistoricoScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Start" component={StartScreen} options={{ title: 'Início' }} />
                <Stack.Screen name="ImagePicker" component={ImagePickerComponent} options={{ title: 'Galeria/Câmera' }} />
                <Stack.Screen name="Contacts" component={ContactsComponent} options={{ title: 'Agenda' }} />
                <Stack.Screen name="Location" component={LocationComponent} options={{ title: 'Localização' }} />
                <Stack.Screen name="Sensors" component={SensorComponent} options={{ title: 'Sensores' }} />
                <Stack.Screen name="RegistroVisita" component={RegistroVisitaScreen} options={{ title: 'Registro de Visita' }} />
                <Stack.Screen name="Historico" component={HistoricoScreen} options={{ title: 'Histórico de Visitas' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}