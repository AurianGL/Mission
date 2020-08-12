import { tradeFunc, SellOrder, BuyOrder, User } from './type';

// tradeFunc resolve a match between a sellOrder and a BuyOrder
// Update the User Account Balcnace accordingly
// Create a new Order if there is somme gold and crypto left after the trade is resolved

export const trade: tradeFunc = props => {
	const { sellOrder, buyOrder, sellOrders, buyOrders, users } = props;
	const goldLeft = sellOrder.quantity - buyOrder.quantity;
	const cryptoLeft = sellOrder.price - buyOrder.price;
	let newBuyOrder: BuyOrder;
	let newSellOrder: SellOrder;
	if (goldLeft > 0) {
		newSellOrder = sellOrder;
		newSellOrder.quantity = goldLeft;
		newSellOrder.price = cryptoLeft;
		newSellOrder.timestamp = Math.round(+new Date() / 1000);
		newSellOrder.id = sellOrders[sellOrders.length - 1].id;
	}
	if (goldLeft < 0) {
		newBuyOrder = buyOrder;
		newBuyOrder.quantity = -goldLeft;
		newBuyOrder.price = -cryptoLeft;
		newBuyOrder.timestamp = Math.round(+new Date() / 1000);
		newBuyOrder.id = sellOrders[sellOrders.length - 1].id;
	}
	const newSellOrders = sellOrders.reduce(
		(newOrders: SellOrder[], thisSellOrder) => {
			if (thisSellOrder.id === sellOrder.id) {
				thisSellOrder.resolved = true;
			}
			newOrders.push(thisSellOrder);
			return newOrders;
		},
		[]
	);
	if (newSellOrder) newSellOrders.push(newSellOrder);
	const newBuyOrders = buyOrders.reduce(
		(newOrders: BuyOrder[], thisSellOrder) => {
			const solvedSellOrder = thisSellOrder;
			if (thisSellOrder.id === sellOrder.id) {
				solvedSellOrder.resolved = true;
			}
			newOrders.push(solvedSellOrder);
			return newOrders;
		},
		[]
	);
	if (newBuyOrder) newBuyOrders.push(newBuyOrder);
	const newUsers = users.reduce((newUsersArr: User[], thisUser) => {
		const user = thisUser;
		if (thisUser.id === sellOrder.userId) {
			user.crypto += Math.min(sellOrder.price, buyOrder.price);
			user.gold -= Math.min(sellOrder.quantity, buyOrder.quantity);
		}
		if (thisUser.id === buyOrder.userId) {
			user.crypto -= Math.min(sellOrder.price, buyOrder.price);
			user.gold += Math.min(sellOrder.quantity, buyOrder.quantity);
		}
		if (thisUser) newUsersArr.push();
		return newUsersArr;
	}, []);
	return [newSellOrders, newBuyOrders, newUsers];
};
