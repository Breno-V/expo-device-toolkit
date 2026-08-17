import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Alert, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import styles from './ContactsStyles';
import { usePermission } from '../../hooks/usePermission';
import PermissionGate from '../PermissionGate/PermissionGate';

const PAGE_SIZE = 20;

const ContactsComponent = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [pageOffset, setPageOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const { status, canAskAgain, isLoading, requestPermission } = usePermission({
        getPermission: Contacts.getPermissionsAsync,
        requestPermission: Contacts.requestPermissionsAsync,
    });

    const loadContacts = async (reset = false) => {
        if (loading || loadingMore) return;

        const offset = reset ? 0 : pageOffset;
        reset ? setLoading(true) : setLoadingMore(true);

        try {
            const query = searchText.trim();
            const options = {
                fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
                sort: Contacts.SortTypes.FirstName,
                pageSize: PAGE_SIZE,
                pageOffset: offset,
            };

            if (query.length > 0) {
                options.name = query;
            }

            const { data } = await Contacts.getContactsAsync(options);

            if (reset) {
                setContacts(data);
                setPageOffset(PAGE_SIZE);
            } else {
                setContacts((prev) => [...prev, ...data]);
                setPageOffset((prev) => prev + PAGE_SIZE);
            }

            setHasMore(data.length >= PAGE_SIZE);
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao carregar os contatos!');
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (status === 'granted') {
            loadContacts(true);
        }
    }, [status]);

    useEffect(() => {
        if (status === 'granted') {
            const timeout = setTimeout(() => {
                loadContacts(true);
            }, 400);
            return () => clearTimeout(timeout);
        }
    }, [searchText]);

    const handleEndReached = useCallback(() => {
        if (hasMore && !loading && !loadingMore) {
            loadContacts(false);
        }
    }, [hasMore, loading, loadingMore, pageOffset]);

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

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#007AFF" />
            </View>
        );
    };

    return (
        <PermissionGate
            icon="users"
            title="Acessar seus contatos"
            description="Para exibir e ligar para seus contatos, precisamos da sua permissão para acessar a lista de contatos."
            status={status}
            canAskAgain={canAskAgain}
            loading={isLoading}
            onRequest={requestPermission}
        >
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Feather name="search" size={18} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar contato..."
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={setSearchText}
                        autoCorrect={false}
                    />
                    {searchText.length > 0 && (
                        <Pressable onPress={() => setSearchText('')}>
                            <Feather name="x" size={18} color="#999" />
                        </Pressable>
                    )}
                </View>

                <View style={styles.listContainer}>
                    {loading && contacts.length === 0 ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#007AFF" />
                        </View>
                    ) : (
                        <FlatList
                            data={contacts}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            contentContainerStyle={styles.list}
                            showsVerticalScrollIndicator={false}
                            onEndReached={handleEndReached}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={renderFooter}
                            ListEmptyComponent={
                                !loading ? (
                                    <View style={styles.loadingContainer}>
                                        <Text style={styles.emptyText}>Nenhum contato encontrado</Text>
                                    </View>
                                ) : null
                            }
                        />
                    )}
                </View>
            </View>
        </PermissionGate>
    );
};

export default ContactsComponent;
