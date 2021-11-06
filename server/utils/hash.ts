import bcrypt from "bcrypt";

export const hashPassword = (receivedPassword: string) => {
	return new Promise<string>((resolve, reject) => {
		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				reject(err);
			}
			bcrypt.hash(receivedPassword, salt, (err, hashedPassword) => {
				if (err) {
					reject(err);
				}
				resolve(hashedPassword);
			});
		});
	});
};

export const comparePassword = (receivedPassword: string, storedHashedPassword: string) => {
	return bcrypt.compare(receivedPassword, storedHashedPassword);
};

//data {currency:'',amount:''}

export const currencyFormatter = (data: { currency: string; amount: number }) => {
	return ((data.amount * 100) / 100).toLocaleString(data.currency, {
		style: "currency",
		currency: data.currency
	});
};

export const formatDate = (time: string,language:string='en-US') => {
	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	const event = new Date(time);
	//@ts-ignore
	return event.toLocaleDateString(language, options)
};

export const formatPrice = (amount: number,currency:string='USD') => {
	return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
};
