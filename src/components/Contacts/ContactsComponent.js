import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, Alert, Pressable, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import styles from './ContactsStyles';
import { usePermission } from '../../hooks/usePermission';
import PermissionGate from '../PermissionGate/PermissionGate';
import ImagePickerComponent from '../ImagePicker/ImagePickerComponent';

const getInitialLetter = (contact) => {
    const name = (contact.firstName || contact.lastName || '').trim();
    const letter = name.charAt(0).toUpperCase();
    return letter >= 'A' && letter <= 'Z' ? letter : '#';
};

const buildSections = (contacts) => {
    const groups = {};

    contacts.forEach((contact) => {
        const letter = getInitialLetter(contact);
        if (!groups[letter]) {
            groups[letter] = [];
        }
        groups[letter].push(contact);
    });

    return Object.keys(groups)
        .sort((a, b) => (a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b)))
        .map((letter) => ({
            title: letter,
            data: groups[letter],
        }));
};

const ContactsComponent = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { status, isLoading, requestPermission } = usePermission({
        getPermission: Contacts.getPermissionsAsync,
        requestPermission: Contacts.requestPermissionsAsync,
    });

    const sections = buildSections(contacts);

    const loadContacts = async () => {
        setLoading(true);
        try {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
                sort: Contacts.SortTypes.FirstName,
            });

            if (data.length > 0) {
                setContacts(data);
            } else {
                Alert.alert('Sem contatos', 'Nenhum contato encontrado!');
            }
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao carregar os contatos!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (status === 'granted' && contacts.length === 0) {
            loadContacts();
        }
    }, [status, contacts.length]);

    const renderItem = ({ item }) => (
        <View style={styles.contactItem}>
            <Text style={styles.contactName}>
                {item.firstName} {item.lastName}
            </Text>
            {item.phoneNumbers?.map((phone, index) => (
                <View key={index} style={styles.contactDetailContainer}>
                    <Feather name="phone" size={16} color="#555" style={styles.icon} />
                    <Text style={styles.contactDetail}>
                        {phone.number}
                    </Text>
                </View>
            ))}
            {item.emails?.map((email, index) => (
                <View key={index} style={styles.contactDetailContainer}>
                    <Feather name="mail" size={16} color="#555" style={styles.icon} />
                    <Text style={styles.contactDetail}>
                        {email.email}
                    </Text>
                </View>
            ))}
        </View>
    );

    const renderSectionHeader = ({ section }) => (
        <Text style={styles.sectionHeader}>{section.title}</Text>
    )

    return (
        <PermissionGate
            icon="users"
            title="Acessar seus contatos"
            description="Para exibir e ligar para seus contatos, precisamos da sua permissão para acessar a lista de contatos."
            status={status}
            loading={isLoading}
            onRequest={requestPermission}
        >
            <View style={styles.container}>
                <ImagePickerComponent />

                <View style={styles.reloadButtonContainer}>

                    <Pressable
                        style={({ pressed }) => [styles.reloadButton, pressed && styles.buttonPressed]}
                        onPress={loadContacts}
                        >
                        <Feather name="refresh-cw" size={20} color="#fff" />
                        <Text style={styles.reloadButtonText}>Recarregar Contatos</Text>
                    </Pressable>
                </View>

                <View style={styles.listContainer}>
                    {loading && contacts.length === 0 ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#007AFF" />
                        </View>
                    ) : (
                        <SectionList
                            sections={sections}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            renderSectionHeader={renderSectionHeader}
                            stickySectionHeadersEnabled
                            contentContainerStyle={styles.list}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </View>
        </PermissionGate>
    );
};

export default ContactsComponent;
