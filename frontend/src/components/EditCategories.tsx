import { categories } from '@/pages/Categories';
import { Edit } from 'lucide-react';
import React, { useState } from 'react'
  interface editProps{
    category:categories
    setCategories: React.Dispatch<React.SetStateAction<categories[]>>;

  }
export default function EditCategories({category,setCategories}:editProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
      name: category.name,
    });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const response = await fetch(`http://localhost:4000/api/category`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${localStorage.getItem("authToken")}`

            },
            body: JSON.stringify({
                currentName:category.name,
                newName:formData.name
            }),
          });
    
          const data = await response.json();
          
          if (response.ok) {
            setCategories((prevCategories:categories[]) =>
                prevCategories.map((c:categories) =>
                c.name === category.name ? { ...c, ...formData } : c
              )
            );
            setIsOpen(false);
          } else {
            console.error('Failed to update customer:', data.message);
          }
        } catch (error) {
          console.error('Error updating customer:', error);
        }
      };
      if (!isOpen) {
        return (
          <button 
            onClick={() => setIsOpen(true)}
            className="p-1 sm:p-2 text-gray-100 hover:text-paleOrange transition-colors"
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        );
      }
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6 sm:p-0">
          <div className="bg-darkgray rounded-lg w-full max-w-[95%] sm:max-w-md md:max-w-lg border border-lighterGray max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-darkgray border-b border-lighterGray px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-base sm:text-lg md:text-xl text-gray-100">تعديل بيانات الفئة</h2>
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
                <label className="block text-gray-100 text-sm sm:text-base text-right">اسم الفئة</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-1.5 sm:p-2 rounded text-sm sm:text-base bg-realyDarkGray text-gray-100 border border-lighterGray focus:border-paleOrange outline-none"
                />
              </div>
    
             
              <div className="flex flex-col-reverse sm:flex-row justify-between gap-2 sm:gap-4 pt-2 sm:pt-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 bg-paleOrange text-darkgray rounded hover:bg-darkOrange transition-colors font-medium text-sm sm:text-base"
                >
                  حفظ التغييرات
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







 

 