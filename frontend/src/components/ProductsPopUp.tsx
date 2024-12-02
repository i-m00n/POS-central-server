import {  useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext,  } from "react-router-dom";
import { categories } from "../pages/Categories";
import { Trash, X } from "lucide-react";
import EditProducts from "./EditProducts";
interface DeleteProductAlert{
  bool:boolean,
  deleteType:string
}
interface OutletType {
  selectedCategoryProduct: categories;
  setSelectedCategoryProduct: React.Dispatch<React.SetStateAction<categories>>;
  setCategories: React.Dispatch<React.SetStateAction<categories[]>>;
}

export default function ProductPopUp() {

    const navigate = useNavigate();
    const {
      selectedCategoryProduct,
      setSelectedCategoryProduct,
      setCategories,
    } = useOutletContext<OutletType>();   

    const [alert,setAlert]= useState<DeleteProductAlert>({bool:false,deleteType:""});
    const [selectedItemToDelete,setSelectedItemToDelete]= useState<string>("");
    const alertRef = useRef<HTMLDivElement>(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
      if (alert.bool && alertRef.current) {
        alertRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [alert.bool]);
    const handleDeleteProduct = (productName: string) => {
      fetch(`${API_BASE_URL}product?name=${productName}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`

          
        }
      })
      .then(res => res.json())
      .then((data) => {
        // Update both categories and selectedCategoryProduct
        setCategories(prev => {
          const updatedCategories = prev.map(category => {
            if (category.name === selectedCategoryProduct.name) {
              const updatedProducts = category.products.filter(
                product => product.name !== data.data.name
              );
              
              // Update selectedCategoryProduct to match
              setSelectedCategoryProduct({
                ...category,
                products: updatedProducts
              });
              
              return {
                ...category,
                products: updatedProducts
              };
            }
            return category;
          });
          
          console.log('Updated categories:', updatedCategories);
          return updatedCategories;
        });
        
        setAlert({ bool: false, deleteType: "" });
      })
      .catch(error => {
        console.error('Error deleting product:', error);
      });
    };

    
    const handleDeleteAllProduct = ()=>{
      fetch(`${API_BASE_URL}product/all`,
        {
          method:"DELETE",
          headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`

          }
        }
      ).then(res=>res.json()).then(()=>{
        setSelectedCategoryProduct({name:selectedCategoryProduct.name,products:[]});
        localStorage.setItem("selectedProduct",JSON.stringify({name:selectedCategoryProduct.name,products:[]}));
        setAlert({bool:false,deleteType:""});
      })
  }
  if (!selectedCategoryProduct || !selectedCategoryProduct.products) {
    return <div className="flex justify-center items-center p-4">Loading...</div>;
  }
    return (
    <>
      <div className="bg-gray-100 rounded-lg shadow-xl p-4 max-w-[90vw] max-h-[90vh] overflow-auto ">
        <div ref={alertRef}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold ">Products Details</h2>
          <button 
            onClick={() => navigate(`/categories`)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          </div>
        </div>
        {alert.bool==true&& <div>
          <p className="xs:text-md md:text-sm lg:text-lg mb-2">هل انت متأكد انك تريد مسح {selectedItemToDelete?selectedItemToDelete : "كل البضاعة"}؟</p>
          <div className="flex justify-center gap-4 transition-colors">
          <button onClick={()=>{
            setAlert({bool:false,deleteType:""});
            setSelectedItemToDelete("");
          }
          } className="xs:text-sm px-4 hover:bg-lighterGray bg-darkgray text-whi rounded-md">لا</button>
          <button className=" xs:text-sm p-2 bg-red text-whi rounded-md hover:bg-light-red " onClick={()=>
            alert.deleteType=="item"?handleDeleteProduct(selectedItemToDelete):handleDeleteAllProduct()
          }>نعم</button>
          </div>
        </div>
        }
        <table className="w-full text-xs sm:text-sm bg-white shadow-lg text-gray-700">
          <thead className="text-[10px] sm:text-xs  lg:text-base uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">اسم المنتج</th>
              <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">سعر المنتج</th>
              <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">مسح منتج</th>
            </tr>
          </thead>
          <tbody className="text-[10px] sm:text-xs lg:text-lg">
            {selectedCategoryProduct.products.map((item,i) => (
              <tr key={i} className={`border-b ${i % 2 === 0 ? "bg-gray-200" : "bg-white"}`}>
                <th scope="row" className="px-2 py-2 sm:px-4 lg:px-6 font-medium text-gray-900 whitespace-nowrap">
                  {item.name}
                </th>
                <td className="px-2 py-2 sm:px-4 lg:px-6">{item.price}</td>
                <td className="px-2 py-2 sm:px-4 lg:px-6 text-center">
                <button className={ "p-2 hover:bg-gray-100 rounded-full transition-colors"} onClick={()=>{
                  setAlert({bool:true,deleteType:"item"});
                  setSelectedItemToDelete(item.name);
                  localStorage.setItem("selectedProduct",JSON.stringify({name:item.name,products:selectedCategoryProduct.products.filter(items=>items.name!==item.name)}));

                }}>
                <Trash className="w-4 h-4 text-gray-600" /> 
                </button>
                </td>
                <td className="px-2 py-2 sm:px-4 lg:px-6 text-center">
                <EditProducts selectedName={item.name} selectedPrice={item.price} selectedCategoryProduct={selectedCategoryProduct} setCategories={setCategories}
                setSelectedCategoryProduct={setSelectedCategoryProduct}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <div className="bg-red hover:bg-light-red text-whi w-52 rounded-md flex justify-center p-0.5">
          <button onClick={()=>{setAlert({bool:true,deleteType:"All"}    
          )

        }}>
            مسح كل المنتجات
          </button>
        </div>
        </>
          
    )
  }