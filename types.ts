// Implemented the application's type definitions.

export type View = 
  | 'dashboard'
  | 'customers'
  | 'stock'
  | 'outstanding'
  | 'counterSales'
  | 'sales'
  | 'expenses'
  | 'inventory'
  | 'schedule'
  | 'reminders'
  | 'bottleTracking'
  | 'salesmen'
  | 'reports'
  | 'closing'
  | 'settings'
  | 'customerDetail'
  | 'inventoryDetail'
  | 'salesmanReport';

export interface Customer {
  id: number;
  name: string;
  houseNumber: string;
  floor: number;
  mobile: string;
  // bottlePrice removed: pricing is derived from inventory item sellPrice
  bottlesPurchased: number;
  paidBottles: number;
  totalBalance: number;
  deliveryDueToday: boolean;
  salesmanId?: number;
  deliveryArea?: string;
  dailyRequirement?: number;
  deliveryDays: string[];
  emptyBottlesOnHand: number;
}

export interface Salesman {
  id: number;
  name: string;
  mobile: string;
  hireDate: string; // ISO date string
}

export interface SaleRecord {
  id: number;
  customerId: number;
  customerName: string;
  bottlesSold: number;
  amountReceived: number;
  date: string; // ISO date string
  salesmanId?: number;
  isCounterSale?: boolean;
  description?: string;
  bottlesReturned: number;
  bottleCategory?: string;
  bottleItemId?: number;
  unitPrice?: number; // recorded unit price used for this sale (from inventory.s sellPrice)
}

export interface Expense {
  id: number;
  date: string; // ISO date string
  category: string;
  description: string;
  amount: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  lowStockThreshold: number;
  sellPrice?: number; // optional selling price per unit
}

export interface BottleLog {
  id: number;
  customerId: number;
  date: string; // ISO date string
  bottlesTaken: number;
  bottlesReturned: number;
}

export interface SalesmanPayment {
    id: number;
    salesmanId: number;
    amount: number;
    date: string; // ISO date string
}

export interface StockAdjustment {
    id: number;
    itemId: number;
    date: string; // ISO date string
    quantityChange: number;
    reason: string;
    adjustedBy: string; // User who made the change
}

export interface MonthlyClosing {
  id: number;
  periodStart: string; // ISO date
  periodEnd: string; // ISO date
  createdAt: string; // ISO date when archived
  sales: SaleRecord[];
  expenses: Expense[];
  totalRevenue: number;
  totalExpenses: number;
}
