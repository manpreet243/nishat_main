import React, { useState, useEffect } from 'react';
import { Customer, Salesman } from '../../types';

interface EditCustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Customer | null;
    onUpdateCustomer: (customer: Customer) => void;
    salesmen: Salesman[];
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({ isOpen, onClose, customer, onUpdateCustomer, salesmen }) => {
    const [name, setName] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [floor, setFloor] = useState(0);
    const [mobile, setMobile] = useState('');
    // bottlePrice removed; pricing comes from inventory items
    const [salesmanId, setSalesmanId] = useState<number | undefined>(undefined);
    const [deliveryArea, setDeliveryArea] = useState('');

    useEffect(() => {
        if (customer) {
            setName(customer.name);
            setHouseNumber(customer.houseNumber);
            setFloor(customer.floor);
            setMobile(customer.mobile);
            // no per-customer price to set
            setSalesmanId(customer.salesmanId);
            setDeliveryArea(customer.deliveryArea || '');
        }
    }, [customer]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customer) {
                onUpdateCustomer({
                ...customer,
                name,
                houseNumber,
                floor,
                mobile,
                salesmanId,
                deliveryArea: deliveryArea || undefined,
            });
        }
    };

    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Edit Customer</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="edit-name" className="block text-sm font-medium text-brand-text-secondary">Full Name</label>
                        <input type="text" id="edit-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="edit-houseNumber" className="block text-sm font-medium text-brand-text-secondary">House Number</label>
                        <input type="text" id="edit-houseNumber" value={houseNumber} onChange={e => setHouseNumber(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="edit-floor" className="block text-sm font-medium text-brand-text-secondary">Floor</label>
                        <input type="number" id="edit-floor" value={floor} onChange={e => setFloor(Number(e.target.value))} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="edit-mobile" className="block text-sm font-medium text-brand-text-secondary">Mobile Number</label>
                        <input type="tel" id="edit-mobile" value={mobile} onChange={e => setMobile(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    {/* Per-customer bottle price removed. */}
                     <div>
                        <label htmlFor="edit-assign-salesman" className="block text-sm font-medium text-brand-text-secondary">Assign Salesman</label>
                        <select
                            id="edit-assign-salesman"
                            value={salesmanId || ''}
                            onChange={e => setSalesmanId(e.target.value ? Number(e.target.value) : undefined)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                        >
                            <option value="">Unassigned</option>
                            {salesmen.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="edit-delivery-area" className="block text-sm font-medium text-brand-text-secondary">Delivery Area</label>
                        <input type="text" id="edit-delivery-area" value={deliveryArea} onChange={e => setDeliveryArea(e.target.value)} placeholder="e.g., North Zone" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue">Update Customer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCustomerModal;