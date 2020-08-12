import { orderFunc, Order } from './type';

// this file exist to eventually test the code but isn't really necessary

const buyStack: Order[] = [];
const sellStack: Order[] = [];
let id = 0;

// add a new order to the right stack
export const order: orderFunc = props => {
	const { type, price, quantity, timestamp, userId } = props;
	const resolved = false;
	const ratio = price / quantity
	const newOrder = { price, quantity, resolved, id, timestamp, userId, ratio};
	switch (type) {
		case 'sell':
			sellStack.push(newOrder);
			return sellStack;
		case 'buy':
			buyStack.push(newOrder);
			return buyStack;
		default:
			break;
	}
};

// create a random new order
const newOrder = () => {
	const type = ['sell', 'buy'][Math.floor(Math.random() * 2)];
	const price = Math.floor(Math.random() * 20) + 20;
	const quantity = Math.floor(Math.random() * 50) + 100;
	const timestamp = Math.round(+new Date() / 1000);
	const userId = Math.floor(Math.random() * 10);
	order({ type, price, quantity, timestamp, userId });
	id += 1;
}

