import { Customer } from '../types';

export interface WhatsAppMessageOptions {
    date?: string; // human readable date to show in the reminder
    multiplier?: number; // PKR per bottle multiplier to show calculations
    previousBalance?: number; // optional previous balance to include
    dailySale?: number; // total sales amount for the day to display
}

export const generateWhatsAppMessageText = (customer: Customer, opts: WhatsAppMessageOptions = {}): string => {
    const unpaidBottles = Math.max(0, (customer.bottlesPurchased || 0) - (customer.paidBottles || 0));
    const bottlesToReturn = customer.emptyBottlesOnHand || 0;

    const multiplier = typeof opts.multiplier === 'number' ? opts.multiplier : 50; // default to 50 (matches example)
    const paidBottles = customer.paidBottles || 0;

    const paidAmount = paidBottles * multiplier;
    const unpaidAmount = unpaidBottles * multiplier;

    const dateLine = opts.date ? `Date: ${opts.date}\n` : '';
    const prevLine = typeof opts.previousBalance === 'number' ? `-previous balance : ${opts.previousBalance.toLocaleString()} \n` : '';
    const dailySaleLine = typeof opts.dailySale === 'number' ? `- Everyday Sale (${opts.date || 'today'}): PKR ${opts.dailySale.toLocaleString()}\n` : '';

    const message = `Hello ${customer.name}, this is a friendly reminder from Nishat Beverages.
${dateLine}
Your Account Summary:
- Remaining Payment: PKR ${customer.totalBalance.toLocaleString()}
${dailySaleLine}- Total Paid Bottles: ${paidBottles}*${multiplier}=${paidAmount.toLocaleString()}
- Total Unpaid Bottles: ${unpaidBottles}*${multiplier}=${unpaidAmount.toLocaleString()}
${prevLine}- Empty Bottles to Return: ${bottlesToReturn}

Thank you!`;

    return message;
};

export const generateWhatsAppReminderUrl = (customer: Customer, opts: WhatsAppMessageOptions = {}): string => {
    const message = generateWhatsAppMessageText(customer, opts);
    const encodedMessage = encodeURIComponent(message);
    // In a real scenario, you would use the customer's mobile number.
    // Make sure the mobile number includes the country code, e.g., 923... for Pakistan
    return `https://wa.me/${customer.mobile}?text=${encodedMessage}`;
};