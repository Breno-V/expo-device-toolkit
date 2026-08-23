import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, Alert, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts/legacy';
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
    // Guard síncrono: state de loading não impede double-fire do onEndReached
    const carregandoRef = useRef(false);
    const { status, canAskAgain, isLoading, requestPermission } = usePermission({
        getPermission: Contacts.getPermissionsAsync,
        requestPermission: Contacts.requestPermissionsAsync,
    });

    const loadContacts = async (reset = false) => {
        if (carregandoRef.current) return;
        carregandoRef.current = true;

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
            const safeData = data ?? [];

            if (reset) {
                // dedupe por id para evitar duplicate keys (ex: 5732)
                const deduped = Array.from(new Map(safeData.map((c) => [c.id, c])).values());
                setContacts(deduped);
                setPageOffset(PAGE_SIZE);
            } else {
                setContacts((prev) => {
                    const map = new Map(prev.map((c) => [c.id, c]));
                    safeData.forEach((c) => {
                        if (!map.has(c.id)) map.set(c.id, c);
                    });
                    return Array.from(map.values());
                });
                setPageOffset((prev) => prev + PAGE_SIZE);
            }

            setHasMore(safeData.length >= PAGE_SIZE);
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao carregar os contatos!');
            console.error(error);
        } finally {
            carregandoRef.current = false;
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Efeito único: carrega ao obter permissão e a cada busca (debounce 300ms).
    // Substitui os dois effects anteriores que causavam carga dupla no mount.
    useEffect(() => {
        if (status !== 'granted') return;
        const timeout = setTimeout(() => {
            loadContacts(true);
        }, 300);
        return () => clearTimeout(timeout);
    }, [status, searchText]);

    const handleEndReached = useCallback(() => {
        if (hasMore && !loading && !loadingMore) {
            loadContacts(false);
        }
    }, [hasMore, loading, loadingMore, pageOffset]);

    const renderItem = ({ item }) => {
        // Contatos não salvos vêm sem firstName/lastName — exibe o número no lugar
        const nome = [item.firstName, item.lastName]
            .filter((parte) => parte && parte.trim())
            .join(' ')
            .trim();
        const primeiroTelefone = item.phoneNumbers?.[0]?.number;

        return (
            <View style={styles.contactItem}>
                <Text style={styles.contactName} numberOfLines={1}>
                    {nome || primeiroTelefone || 'Contato sem nome'}
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
    };

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#16A34A" />
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
                            <ActivityIndicator size="large" color="#16A34A" />
                        </View>
                    ) : (
                        <FlatList
                            data={contacts}
                            keyExtractor={(item, index) => `${item.id ?? 'no-id'}_${index}`}
                            renderItem={renderItem}
                            initialNumToRender={12}
                            maxToRenderPerBatch={12}
                            windowSize={7}
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
