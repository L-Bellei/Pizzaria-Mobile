import React, { useState, createContext, ReactNode, useEffect } from 'react';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SignInProps = {
	email: string;
	password: string;
};

type AuthProviderProps = {
	children: ReactNode;
};

type AuthContextData = {
	user: UserProps;
	isAuthenticated: boolean;
	signIn: (credentials: SignInProps) => Promise<void>;
	signOut: () => Promise<void>;
	loadingAuth: boolean;
	loading: boolean;
};

type UserProps = {
	id: string;
	name: string;
	email: string;
	token: string;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
	const [loadingAuth, setLoadingAuth] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [user, setUser] = useState<UserProps>({
		id: '',
		name: '',
		email: '',
		token: '',
	});

	useEffect(() => {
		async function getUser() {
			const userInfo = await AsyncStorage.getItem('@pizzaria');
			let hasUser: UserProps = JSON.parse(userInfo || '{}');

			if (Object.keys(hasUser).length > 0) {
				api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`;

				setUser({
					id: hasUser.id,
					email: hasUser.email,
					name: hasUser.name,
					token: hasUser.token,
				});
			}

			setLoading(false);
		}

		getUser();
	}, []);

	const isAuthenticated = !!user.name;

	async function signIn({ email, password }: SignInProps) {
		try {
			setLoadingAuth(true);

			const response = await api.post('/session', {
				email,
				password,
			});

			const { id, name, token } = response.data;
			const data = { ...response.data };

			await AsyncStorage.setItem('@pizzaria', JSON.stringify(data));

			api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

			setUser({ id, name, email, token });
			setLoadingAuth(false);
		} catch (err) {
			console.log('Erro ao acessar', err);
			setLoadingAuth(false);
		}
	}

	async function signOut() {
		await AsyncStorage.clear().then(() => {
			setUser({
				id: '',
				name: '',
				email: '',
				token: '',
			});
		});
	}

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, loadingAuth, loading }}>
			{children}
		</AuthContext.Provider>
	);
}
