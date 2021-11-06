// data {currency,amount}
export const currencyFormatter = (cost: {
	currency: string;
	amount: number;
}) => {
	return ((cost.amount * 100) / 100).toLocaleString(cost.currency, {
		style: "currency",
		currency: cost.currency,
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