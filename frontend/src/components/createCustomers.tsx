import React, { useState } from 'react';
import { Plus } from "lucide-react";
import { Customer } from '@/interfaces/customer';

interface CreateCustomerDialogProps {
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

export default function CreateCustomerDialog({ setCustomers }: CreateCustomerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    total_paid: '',
    class: 'عميل عادي'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/api/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`

        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setCustomers(prevCustomers => [...(prevCustomers||[]), data.data]);
        setIsOpen(false);
        setFormData({
          name: '',
          phone_number: '',
          total_paid: '',
          class: 'عميل عادي'
        });
      } else {
        console.error('Failed to create customer:', data.message);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-paleOrange text-darkgray rounded hover:bg-darkOrange transition-colors text-sm sm:text-base"
      >
        <Plus className="h-4 w-4" />
        إضافة عميل جديد
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6 sm:p-0">
      <div className="bg-darkgray rounded-lg w-full max-w-[95%] sm:max-w-md md:max-w-lg border border-lighterGray max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-darkgray border-b border-lighterGray px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base sm:text-lg md:text-xl text-gray-100">إضافة عميل جديد</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-200 hover:text-paleOrange p-1"
            >
              ✕
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 space-y-3 sm:space-y-4">
          <div className="space-y-1 sm:space-y-2">
            <label className="block text-gray-100 text-sm sm:text-base">اسم العميل</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-1.5 sm:p-2 rounded text-sm sm:text-base bg-realyDarkGray text-gray-100 border border-lighterGray focus:border-paleOrange outline-none"
              required
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="block text-gray-100 text-sm sm:text-base">رقم العميل</label>
            <input
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full p-1.5 sm:p-2 rounded text-sm sm:text-base bg-realyDarkGray text-gray-100 border border-lighterGray focus:border-paleOrange outline-none"
              required
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="block text-gray-100 text-sm sm:text-base">كل السعر المدفوع</label>
            <input
              type="number"
              value={formData.total_paid}
              onChange={(e) => setFormData({ ...formData, total_paid: e.target.value })}
              className="w-full p-1.5 sm:p-2 rounded text-sm sm:text-base bg-realyDarkGray text-gray-100 border border-lighterGray focus:border-paleOrange outline-none"
              required
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="block text-gray-100 text-sm sm:text-base">فئة العميل</label>
            <select
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              className="w-full p-1.5 sm:p-2 rounded text-sm sm:text-base bg-realyDarkGray text-gray-100 border border-lighterGray focus:border-paleOrange outline-none"
            >
              <option value="عميل عادي">عميل عادي</option>
              <option value="عميل مهم">عميل مهم</option>
              <option value="طالب">طالب</option>
            </select>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-between gap-2 sm:gap-4 pt-2 sm:pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 bg-paleOrange text-darkgray rounded hover:bg-darkOrange transition-colors font-medium text-sm sm:text-base"
            >
              إضافة العميل
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 border border-lighterGray text-gray-100 rounded hover:bg-lighterGray transition-colors text-sm sm:text-base"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}