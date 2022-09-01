import React, { useState, createContext, ReactNode } from 'react';

type AuthProviderProps = {
	children: ReactNode;
};

type AuthContextData = {
	user: UserProps;
	isAuthenticated: boolean;
};

type UserProps = {
	id: string;
	name: string;
	email: string;
	token: string;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<UserProps>({
		id: '',
		name: '',
		email: '',
		token: '',
	});

	const isAuthenticated = !!user.name;

	return <AuthContext.Provider value={{ user, isAuthenticated }}>{children}</AuthContext.Provider>;
}
