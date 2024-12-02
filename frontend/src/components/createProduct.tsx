import React, { useState } from 'react'
import { PackagePlus } from 'lucide-react';
import { categories } from '@/pages/Categories';
interface createProps{
    setCategories: React.Dispatch<React.SetStateAction<categories[]>>;
    category: string;
}
export default function CreateProduct({setCategories,category}:createProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
    name: '',
    price:'',
    measure:'liter',
    category:category
    });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const response = await fetch(`http://localhost:4000/api/product`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${localStorage.getItem("authToken")}`

            },
            body: JSON.stringify({
                name:formData.name,
                measure:formData.measure,
                price:formData.price,
                category:formData.category
            }),
          });
    
          const data = await response.json();
          if (response.ok) {
            console.log(data);
            setCategories((prevCategories:categories[]) => 
                prevCategories.map((cat:categories) => 
                    cat.name === category
        ? 
                    {
                        ...cat,
                        products: [...(cat.products || []), {name:formData.name,price:+formData.price,measure:formData.measure}]
                      }
                    : cat
                )
              );
                
            setIsOpen(false);
            setFormData({
              name: '',
              price:'',
              measure:'liter',
              category:category
            });
          } else {
            console.error('Failed to create Product:', data.message);
          }
        } catch (error) {
          console.error('Error creating Product:', error);
        }
      };
 if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-gray-100 rounded hover:text-darkOrange transition-colors text-sm sm:text-base"
      >
        <PackagePlus/>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6 sm:p-0">
      <div className="bg-darkgray rounded-lg w-full max-w-[95%] sm:max-w-md md:max-w-lg border border-lighterGray max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-darkgray border-b border-lighterGray px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base sm:text-lg md:text-xl text-gray-100">إضافة بضاعة جديدة</h2>
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
            <label className="block text-gray-100 text-sm sm:text-base text-right">اسم المنتج</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-1.5 sm:p-2 rounded text-sm sm:text-base bg-realyDarkGray text-gray-100 border border-lighterGray focus:border-paleOrange outline-none"
              required
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label className="block text-gray-100 text-sm sm:text-base text-right">سعر المنتج</label>
            <input
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full p-1.5 sm:p-2 rounded text-sm sm:text-base bg-realyDarkGray text-gray-100 border border-lighterGray focus:border-paleOrange outline-none"
              required
            />
          </div>

        

          <div className="flex flex-col-reverse sm:flex-row justify-between gap-2 sm:gap-4 pt-2 sm:pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 bg-paleOrange text-darkgray rounded hover:bg-darkOrange transition-colors font-medium text-sm sm:text-base"
            >
              إضافة منتج
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