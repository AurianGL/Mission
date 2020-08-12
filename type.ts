// I used TS because I felt being aware of the data Schema would help me
// and overAll I feel I code quicker with TS and I like the way it make me think

export interface tradeProps {
	sellOrder: SellOrder;
	buyOrder: BuyOrder;
	sellOrders: SellOrder[];
	buyOrders: BuyOrder[];
	users: User[];
}

export type tradeFunc = (
	props: tradeProps
) => [SellOrder[], BuyOrder[], User[]];

export interface Order {
	id?: number;
	type?: string;
	userId: number;
	price: number;
  quantity: number;
  ratio?: number;
	resolved?: boolean;
	timestamp: number;
}

export interface SellOrder extends Order {
	type: 'sell';
}

export interface BuyOrder extends Order {
	type: 'buy';
}

export type orderFunc = (props: Order) => void;

export interface User {
	id: number;
	gold: number;
	crypto: number;
}

export interface Block {
	users: User[];
	sellOrders:SellOrder[];
  buyOrders: BuyOrder[];
}

export type BlockFunc = (props: Block) => Block;


export type addBlock = (sellOrders: SellOrder[], buyOrders: BuyOrder[]) => void