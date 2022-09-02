import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { api } from '../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';

export default function Dashboard() {
	const [number, setNumber] = useState<string>('');
	const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

	async function openOder() {
		if (number === '') return;

		const response = await api.post('/order', {
			table: +number,
		});

		const { id } = response.data;

		navigation.navigate('Order', {
			number: number,
			order_id: id,
		});

		setNumber('');
	}

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Novo Pedido</Text>
			<TextInput
				value={number}
				onChangeText={setNumber}
				style={styles.input}
				keyboardType="numeric"
				placeholder="Numero da mesa"
				placeholderTextColor="#f0f0f0"
			/>
			<TouchableOpacity
				style={styles.button}
				onPress={openOder}>
				<Text style={styles.buttonText}>Abrir mesa</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 15,
		backgroundColor: '#1d1d2e',
	},
	title: {
		fontSize: 30,
		fontWeight: 'bold',
		color: '#fff',
		marginBottom: 24,
	},
	input: {
		width: '90%',
		height: 60,
		backgroundColor: '#101026',
		borderRadius: 6,
		paddingHorizontal: 8,
		textAlign: 'center',
		fontSize: 22,
		color: '#fff',
	},
	button: {
		width: '90%',
		height: 40,
		backgroundColor: '#3fffa3',
		borderRadius: 6,
		marginVertical: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		fontSize: 18,
		color: '#101026',
		fontWeight: 'bold',
	},
});
