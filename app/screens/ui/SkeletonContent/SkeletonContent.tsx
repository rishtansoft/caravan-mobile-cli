import SkeletonContent from 'react-native-skeleton-content';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, Alert, RefreshControl } from 'react-native';

export default function Placeholder() {
    return (
        <SkeletonContent
            containerStyle={{ flex: 1, width: 300 }}
            isLoading={false}
            layout={[
                { key: 'someId', width: 220, height: 20, marginBottom: 6 },
                { key: 'someOtherId', width: 180, height: 20, marginBottom: 6 }
            ]}
        >
        </SkeletonContent>
    );
}