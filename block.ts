import { trade } from './trade';
import { Order, Block, BlockFunc, addBlock, SellOrder, BuyOrder } from './type';

// each block represent a state of the market containing User account balance and every orders

const blockArr: Block[] = [];

const unsolvedOrders = (orders: Order[]) => {
	return orders.filter(order => !order.resolved);
};

// sort Orders by Ratio and Amount of gold and crypto
const sortOrders = (orders: Order[]) => {
	orders.sort((a, b) => {
		return a.ratio - b.ratio ? a.ratio - b.ratio : a.price - b.price;
	});
	return orders;
};

// create a new block my matching unresolved orders and then using the trade function to relove them
const newBlock: BlockFunc = block => {
	const date = Math.round(+new Date() / 1000);
	const { users, sellOrders, buyOrders } = block;
	let [UdSellOrders, UdBuyOrders, UdUsers] = [sellOrders, buyOrders, users];
	let unsolvedSellOrders = sortOrders(
		unsolvedOrders(sellOrders)
	) as SellOrder[];
  let unsolvedBuyOrders = sortOrders(unsolvedOrders(buyOrders)) as BuyOrder[];
  // iterating over sorted unresolved orders to match them
	unsolvedBuyOrders.forEach(buyOrder => {
		const sellOrder = unsolvedSellOrders.find(
			sellOrder => sellOrder.ratio === buyOrder.ratio
		);
		if (sellOrder) {
			unsolvedSellOrders = unsolvedSellOrders.filter(
				SO => SO.id !== sellOrder.id
			);
			[UdSellOrders, UdBuyOrders, UdUsers] = trade({
				sellOrder,
				buyOrder,
				sellOrders: UdSellOrders,
				buyOrders: UdBuyOrders,
				users: UdUsers,
			});
		}
	});

	return { users: UdUsers, sellOrders: UdSellOrders, buyOrders: UdBuyOrders };
};

// take new sellOrders and buyOrders and add the next Block to the Block Array
const addBlock: addBlock = (sellOrders, buyOrders) => {
	const lastBlock = blockArr[blockArr.length - 1];
	lastBlock.buyOrders = [...lastBlock.buyOrders, ...buyOrders];
	lastBlock.sellOrders = [...lastBlock.sellOrders, ...sellOrders];
	const nextBlock = newBlock(lastBlock);
	blockArr.push(nextBlock);
};

// this could be much more refine
// each match / trades could be stored in blocks
// match could try to match not only by size and ratio, but also by closest quantity 
// match could be over cluster of orders but this would be a bit more complex
// I think for this kind of useCase keeping data integrity is important and I used a bit too much mutation too my taste