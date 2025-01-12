import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
	interface User extends DefaultUser {
		id: string; // O number si usas IDs numéricos
		role: string;
		isApproved: boolean;
	}

	interface Session {
		user: DefaultSession["user"] & {
			id: string;
			role: string;
			isApproved: boolean;
		};
	}

	interface User extends DefaultUser {
		id: string;
		role: string;
		isApproved: boolean;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		role: string;
		isApproved: boolean;
	}
}