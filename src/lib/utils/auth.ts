import jwt from 'jsonwebtoken';
import ENV from '$lib/vars/private';
const { DEBUG, PRIVATE_TOKEN_SECRET = null } = ENV;

export const verifyToken = (token: string): object => {
	try {
		return jwt.verify(token, PRIVATE_TOKEN_SECRET);
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const generateToken = (
	user: object,
	type: string = 'Refresh',
	expiresIn: string = '180m'
): { user: object; token: string } => {
	try {
		const { uid, email } = user;
		return {
			user,
			token: jwt.sign(
				{ uid, email },
				PRIVATE_TOKEN_SECRET,
				type === 'Access' && !!expiresIn ? { expiresIn } : {}
			)
		};
	} catch (err) {
		console.error(err);
		return null;
	}
};
