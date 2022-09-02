import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { api } from '../../services/api';
import ModalPicker from '../../components/ModalPicker';
import ListItem from '../../components/ListItem';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';

type RouteDetailParams = {
	Order: {
		number: number | string;
		order_id: string;
	};
};

export type CategoryProps = {
	id: string;
	name: string;
};

type ProductProps = {
	id: string;
	name: string;
};

type ItemProps = {
	id: string;
	product_id: string;
	name: string;
	amount: string | number;
};

type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>;

const Order = () => {
	const [category, setCategory] = useState<CategoryProps[] | []>([]);
	const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>();
	const [amount, setAmount] = useState('1');
	const [items, setItems] = useState<ItemProps[] | []>([]);
	const [products, setProducts] = useState<ProductProps[] | []>([]);
	const [productSelected, setProductSelected] = useState<ProductProps | undefined>();
	const [modalProductVisible, setModalProductVisible] = useState<boolean>(false);
	const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
	const route = useRoute<OrderRouteProps>();
	const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

	useEffect(() => {
		async function loadInfo() {
			try {
				const response = await api.get('/category');

				setCategory(response.data);
				setCategorySelected(response.data[0]);
			} catch (err) {
				console.log('Erro ao carregar as categorias', err);
			}
		}
		loadInfo();
	}, []);

	useEffect(() => {
		async function loadProducts() {
			try {
				const response = await api.get('/category/product', {
					params: {
						category_id: categorySelected?.id,
					},
				});

				setProducts(response.data);
				setProductSelected(response.data[0]);
			} catch (err) {
				console.log('Erro ao listar os produtos', err);
			}
		}

		loadProducts();
	}, [categorySelected]);

	async function handleCloseOrder() {
		try {
			await api.delete('/order', {
				params: {
					order_id: route.params?.order_id,
				},
			});

			navigation.goBack();
		} catch (err) {
			console.log('Erro ao deletar a mesa', err);
		}
	}

	async function handleAdd() {
		try {
			const response = await api.post('/order/add', {
				order_id: route.params.order_id,
				product_id: productSelected?.id,
				amount: +amount,
			});

			let data = {
				id: response.data.id,
				product_id: productSelected?.id as string,
				name: productSelected?.name as string,
				amount: amount,
			};

			setItems((oldArray) => [...oldArray, data]);
		} catch (err) {
			console.log('Erro ao adicionar o item', err);
		}
	}

	async function handleDeleteItem(item_id: string) {
		try {
			await api.delete('/order/remove', {
				params: {
					item_id: item_id,
				},
			});

			let removeItem = items.filter((item) => {
				return item.id !== item_id;
			});

			setItems(removeItem);
		} catch (err) {
			console.log('Erro ao excluir item do pedido', err);
		}
	}

	function handleFinishOrder() {
		navigation.navigate('FinishOrder', {
			number: route.params?.number,
			order_id: route.params?.order_id,
		});
	}

	function handleChangeCategory(item: CategoryProps) {
		setCategorySelected(item);
	}

	function handleChangeProduct(item: ProductProps) {
		setProductSelected(item);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Mesa {route.params.number}</Text>
				{items.length === 0 && (
					<TouchableOpacity onPress={handleCloseOrder}>
						<Feather
							name="trash-2"
							size={28}
							color="#ff3f4b"
						/>
					</TouchableOpacity>
				)}
			</View>

			{category.length !== 0 && (
				<TouchableOpacity
					style={styles.input}
					onPress={() => setModalCategoryVisible(true)}>
					<Text style={{ color: '#fff' }}>{categorySelected?.name}</Text>
				</TouchableOpacity>
			)}

			{products.length !== 0 && (
				<TouchableOpacity
					style={styles.input}
					onPress={() => setModalProductVisible(true)}>
					<Text style={{ color: '#fff' }}>{productSelected?.name}</Text>
				</TouchableOpacity>
			)}

			<View style={styles.qtdContainer}>
				<Text style={styles.qtdText}>Quantidade</Text>
				<TextInput
					style={[styles.input, { width: '60%', textAlign: 'center' }]}
					placeholder="1"
					placeholderTextColor="#f0f0f0"
					keyboardType="numeric"
					value={amount}
					onChangeText={setAmount}
				/>
			</View>

			<View style={styles.actions}>
				<TouchableOpacity
					style={styles.buttonAdd}
					onPress={handleAdd}>
					<Text style={styles.buttonText}>+</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={handleFinishOrder}
					style={[styles.button, { opacity: items.length === 0 ? 0.3 : 1 }]}
					disabled={items.length === 0}>
					<Text style={styles.buttonText}>Avançar</Text>
				</TouchableOpacity>
			</View>

			<FlatList
				showsVerticalScrollIndicator={false}
				style={{ flex: 1, marginTop: 24 }}
				data={items}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<ListItem
						data={item}
						deleteItem={handleDeleteItem}
					/>
				)}
			/>

			<Modal
				transparent={true}
				visible={modalCategoryVisible}
				animationType="fade">
				<ModalPicker
					handleCloseModal={() => setModalCategoryVisible(false)}
					options={category}
					selectedItem={handleChangeCategory}
				/>
			</Modal>

			<Modal
				transparent={true}
				visible={modalProductVisible}
				animationType="fade">
				<ModalPicker
					handleCloseModal={() => setModalProductVisible(false)}
					options={products}
					selectedItem={handleChangeProduct}
				/>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#1d1d2e',
		paddingVertical: '5%',
		paddingEnd: '4%',
		paddingStart: '4%',
	},
	header: {
		flexDirection: 'row',
		marginBottom: 12,
		alignItems: 'center',
		marginTop: 24,
	},
	title: {
		fontSize: 30,
		fontWeight: 'bold',
		color: '#fff',
		marginRight: 14,
	},
	input: {
		backgroundColor: '#101026',
		borderRadius: 6,
		width: '100%',
		height: 40,
		marginBottom: 12,
		justifyContent: 'center',
		paddingHorizontal: 8,
		color: '#fff',
		fontSize: 20,
	},
	qtdContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	qtdText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#fff',
	},
	actions: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
	},
	buttonAdd: {
		backgroundColor: '#3fd1ff',
		borderRadius: 6,
		width: '20%',
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		color: '#101026',
		fontSize: 18,
		fontWeight: 'bold',
	},
	button: {
		backgroundColor: '#3fffa3',
		borderRadius: 6,
		height: 40,
		width: '75%',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Order;
