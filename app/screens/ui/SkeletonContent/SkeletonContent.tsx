import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@rneui/themed';

export default function ColorfulPlaceholder() {
    const skeletonColors = [
        '#DADDDE',
        '#DADDDE',   // Yashil-ko'k
        '#DADDDE',   // Moviy
        '#DADDDE',   // Sariq
        '#DADDDE',   // Siyrak-binafsha
    ];

    return (
        <View style={styles.container}>
            {skeletonColors.map((color, index) => (
                <Skeleton
                    key={index}
                    width={340 - index * 35}
                    height={45}
                    animation="wave"
                    animationType="pulse"
                    backgroundColor={color}
                    highlightColor={`${color}70`}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10,
        marginHorizontal: 2
    }
});