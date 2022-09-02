import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { CategoryProps } from '../../pages/Order';

interface ModalPickerProps {
	options: CategoryProps[];
	handleCloseModal: () => void;
	selectedItem: (item: CategoryProps) => void;
}

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

export default function ModalPicker({ handleCloseModal, options, selectedItem }: ModalPickerProps) {
	function onPressItem(item: CategoryProps) {
		selectedItem(item);
		handleCloseModal();
	}

	const option = options.map((item, index) => (
		<TouchableOpacity
			key={index}
			style={styles.option}
			onPress={() => onPressItem(item)}>
			<Text style={styles.item}>{item?.name}</Text>
		</TouchableOpacity>
	));

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={handleCloseModal}>
			<View style={styles.content}>
				<ScrollView showsVerticalScrollIndicator={false}>{option}</ScrollView>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		width: WIDTH - 20,
		height: HEIGHT / 2,
		backgroundColor: '#101026',
		borderWidth: 1,
		borderColor: '#8a8a8a',
		borderRadius: 6,
	},
	option: {
		alignItems: 'flex-start',
		borderBottomWidth: 1,
		borderBottomColor: '#fff',
	},
	item: {
		margin: 18,
		fontSize: 16,
		fontWeight: 'bold',
		color: '#fff',
	},
});
