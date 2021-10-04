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
