import React, { useState, useMemo } from 'react';
import { SaleRecord, Expense, Customer } from '../../types';
import StatCard from './StatCard';
import SimpleBarChart from '../reports/SimpleBarChart';
import { DollarSignIcon } from '../icons/DollarSignIcon';
import { CreditCardIcon } from '../icons/CreditCardIcon';
import { FileTextIcon } from '../icons/FileTextIcon';
import { SearchIcon } from '../icons/SearchIcon';

interface ReportsProps {
    sales: SaleRecord[];
    expenses: Expense[];
    customers: Customer[];
}

type FilterType = 'today' | 'month' | 'year' | 'custom';

const Reports: React.FC<ReportsProps> = ({ sales, expenses, customers }) => {
    
    const [filterType, setFilterType] = useState<FilterType>('month');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [customerSearch, setCustomerSearch] = useState('');

    const dateRange = useMemo(() => {
        const today = new Date();
        const startOfDay = (date: Date) => new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = (date: Date) => new Date(date.setHours(23, 59, 59, 999));
        
        let start = new Date();
        let end = new Date();

        switch(filterType) {
            case 'today':
                start = startOfDay(today);
                end = endOfDay(today);
                break;
            case 'month':
                start = startOfDay(new Date(today.getFullYear(), today.getMonth(), 1));
                end = endOfDay(new Date(today.getFullYear(), today.getMonth() + 1, 0));
                break;
            case 'year':
                start = startOfDay(new Date(today.getFullYear(), 0, 1));
                end = endOfDay(new Date(today.getFullYear(), 11, 31));
                break;
            case 'custom':
                start = customStartDate ? startOfDay(new Date(customStartDate)) : startOfDay(new Date('1970-01-01'));
                end = customEndDate ? endOfDay(new Date(customEndDate)) : endOfDay(new Date());
                break;
        }
        return { start, end };
    }, [filterType, customStartDate, customEndDate]);

    const filteredData = useMemo(() => {
        const { start, end } = dateRange;
        
        const filteredSales = sales.filter(s => {
            const saleDate = new Date(s.date);
            const matchesDate = saleDate >= start && saleDate <= end;
            const customer = customers.find(c => c.id === s.customerId);
            const customerName = customer ? customer.name : s.customerName;
            const matchesCustomer = customerSearch === '' || customerName.toLowerCase().includes(customerSearch.toLowerCase());
            return matchesDate && matchesCustomer;
        });

        const filteredExpenses = expenses.filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate >= start && expenseDate <= end;
        });

        return { filteredSales, filteredExpenses };
    }, [sales, expenses, customers, dateRange, customerSearch]);

    const stats = useMemo(() => {
        const totalRevenue = filteredData.filteredSales.reduce((acc, s) => acc + s.amountReceived, 0);
        const totalExpenses = filteredData.filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
        const netProfit = totalRevenue - totalExpenses;
        return { totalRevenue, totalExpenses, netProfit };
    }, [filteredData]);

    const chartData = useMemo(() => ([
        { name: 'Revenue', value: stats.totalRevenue },
        { name: 'Expenses', value: stats.totalExpenses }
    ]), [stats]);

    const handlePrint = () => {
        window.print();
    };

    const getFilterLabel = () => {
        switch(filterType) {
            case 'today': return 'Today';
            case 'month': return 'This Month';
            case 'year': return 'This Year';
            case 'custom': 
                if (customStartDate && customEndDate) {
                    return `${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}`
                }
                return 'Custom Range';
            default: return 'Report';
        }
    };

    return (
        <div>
            <div className="no-print flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-brand-text-primary">Business Reports</h1>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => setFilterType('today')} className={`px-3 py-1 text-sm rounded-full ${filterType === 'today' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>Today</button>
                    <button onClick={() => setFilterType('month')} className={`px-3 py-1 text-sm rounded-full ${filterType === 'month' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>This Month</button>
                    <button onClick={() => setFilterType('year')} className={`px-3 py-1 text-sm rounded-full ${filterType === 'year' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>This Year</button>
                    <button onClick={() => setFilterType('custom')} className={`px-3 py-1 text-sm rounded-full ${filterType === 'custom' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>Custom</button>
                    {filterType === 'custom' && (
                        <div className="flex gap-2">
                             <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="px-2 py-1 text-sm border rounded"/>
                             <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="px-2 py-1 text-sm border rounded"/>
                        </div>
                    )}
                    <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue">
                        <FileTextIcon className="h-5 w-5 mr-2"/> Print Report
                    </button>
                </div>
            </div>

            <div className="bg-brand-surface rounded-xl shadow-md p-6 printable-area">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-brand-text-primary text-center">Business Report: {getFilterLabel()}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Revenue" value={`PKR ${stats.totalRevenue.toLocaleString()}`} icon={<DollarSignIcon />} color="text-green-500" />
                    <StatCard title="Total Expenses" value={`PKR ${stats.totalExpenses.toLocaleString()}`} icon={<CreditCardIcon />} color="text-red-500" />
                    <StatCard title="Net Profit" value={`PKR ${stats.netProfit.toLocaleString()}`} icon={<span></span>} color={stats.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="p-6 rounded-xl border">
                        <h3 className="text-xl font-bold text-brand-text-primary mb-4">Revenue vs Expenses</h3>
                        <SimpleBarChart data={chartData} dataKey="value" />
                    </div>
                    <div className="p-6 rounded-xl border">
                        <h3 className="text-xl font-bold text-brand-text-primary mb-4">Top Customers</h3>
                        {/* Placeholder for top customers logic */}
                        <p className="text-center text-brand-text-secondary py-10">Top customer analysis coming soon.</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-brand-text-primary mb-4">Transactions</h3>
                    <div className="relative mb-4 no-print">
                        <input
                            type="text"
                            placeholder="Search by customer name..."
                            value={customerSearch}
                            onChange={(e) => setCustomerSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                             <h4 className="font-bold text-lg mb-2">Sales ({filteredData.filteredSales.length})</h4>
                             <div className="border rounded-lg overflow-auto max-h-96">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0"><tr><th className="px-4 py-2 text-left">Customer</th><th className="px-4 py-2 text-right">Amount (PKR)</th></tr></thead>
                                    <tbody className="divide-y">{filteredData.filteredSales.map(s => <tr key={s.id}>
                                        <td className="px-4 py-2">{s.customerName}</td>
                                        <td className="px-4 py-2 text-right font-medium">{s.amountReceived.toLocaleString()}</td>
                                    </tr>)}</tbody>
                                </table>
                            </div>
                        </div>
                         <div>
                            <h4 className="font-bold text-lg mb-2">Expenses ({filteredData.filteredExpenses.length})</h4>
                             <div className="border rounded-lg overflow-auto max-h-96">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0"><tr><th className="px-4 py-2 text-left">Description</th><th className="px-4 py-2 text-right">Amount (PKR)</th></tr></thead>
                                    <tbody className="divide-y">{filteredData.filteredExpenses.map(e => <tr key={e.id}>
                                        <td className="px-4 py-2">{e.description}</td>
                                        <td className="px-4 py-2 text-right font-medium">{e.amount.toLocaleString()}</td>
                                    </tr>)}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;