import { Eye } from 'lucide-react';
import  { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import DeleteButtonWithConfirm from '../components/DeleteWithConfirm';
import CreateCategory from '../components/CreateCategory';
import EditCategories from '../components/EditCategories';
import CreateProduct from '../components/createProduct';
export interface Products{
  id?:number,
  name:string,
  measure:string,
  price:number
}

export interface categories{
  name:string,
  products:Products[]
}
export default function Categories() {

  const [categories,setCategories] = useState<categories[]>([]);
  const[selectedCategoryProduct,setSelectedCategoryProduct] = useState<categories>((JSON.parse(localStorage.getItem("selectedProduct") || ""))||{name:"",products:[]});
  useEffect(()=>{
    fetch("/api/category/all",
      {
        headers:{
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`

        }
      }
    ).then(res=>res.json()).then(
      data=>{
        console.log(data);
        setCategories(data.data);
      }
    )
  },[])
  const navigate= useNavigate();
  const handleViewButton = (name: string, navigation_part: string) => {
    const category: categories = categories.find(cat => cat.name === name) ?? { name: "", products: [] };
    setSelectedCategoryProduct(category);
    
    localStorage.setItem("selectedProduct",JSON.stringify(category));
    navigate(`/${navigation_part}/${name}`);
  };
  
    const handleClosePopup = (navigation_part:string) => {
      navigate(`/${navigation_part}`);
    }
    const handleDeleteCategory= (name:string)=>{
        fetch(`/api/category?name=${name}`,
          {
            method:"DELETE"
            ,headers:{
              "Content-Type":"application/json"
              ,
              "Authorization": `Bearer ${localStorage.getItem("authToken")}`

            },
          }
        ).then(res=>res.json()).then(
          data=>{
            console.log(data);
            setCategories(prevCategories=>
              prevCategories.filter(category=>category.name !==name)
            )
          })
        }
    const handleDeleteAllCategories= ()=>{
        fetch(`/api/category/all`,
          {
            method:"DELETE"
            ,headers:{
              "Content-Type":"application/json",
              "Authorization": `Bearer ${localStorage.getItem("authToken")}`

            },
          }
        ).then(res=>res.json()).then(
          data=>{
            console.log(data);
            setCategories([]);
          })
        }

  const params = useParams();
return (
  <div className='flex flex-col items-center'>
    <div className="w-fit text-center overflow-x-auto my-3 sm:my-6 rounded-md shadow-xl shadow-realyDarkGray">
    <div className="">
      <table className="w-600px text-xs sm:text-sm bg-paleBlack shadow-lg shadow-realyDarkGray text-gray-200">
        <thead className="text-[10px] sm:text-xs lg:text-base text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">الفئة</th>
            <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">اظهار المنتجات</th>
            <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">مسح الفئة</th>
            <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">تعديل الفئة</th>
            <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">اضافة منتج</th>
          </tr>
        </thead>
        <tbody className="text-[10px] sm:text-xs lg:text-lg">
          {!categories?
  
              <div>LOADING</div>    
          :
          categories.map((item,i) => (
            <tr key={i} className={`bg-white border-b ${i % 2 == 0 ? "bg-bg-color" : "bg-paleBlack"}`}>
              <td className="px-2 py-2 sm:px-4 lg:px-6">{item.name}</td>
             
              <td className="px-2 py-2 sm:px-4 lg:px-6">
              <button 
                  onClick={() => {handleViewButton(item.name,"categories")
                    setSelectedCategoryProduct(item);
                    localStorage.setItem("selectedProduct",JSON.stringify(item));

                  }
                  }
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </td>
              <td className="px-2 py-2 sm:px-4 lg:px-6">
                <DeleteButtonWithConfirm onDelete={()=>handleDeleteCategory(item.name)} itemName={item.name}/>
              
              </td>
              <td className="px-2 py-2 sm:px-4 lg:px-6">
                  <EditCategories category={item} setCategories={setCategories}/>
              </td>
              <td className="px-2 py-2 sm:px-4 lg:px-6">
                  <CreateProduct key={item.name} category={item.name} setCategories={setCategories}/>
              </td>
            </tr>
          ))
        }
        </tbody>
      </table> 
  </div>
  
      {/* Only added this part for the popup functionality */}
      {params.name && (
        <div 
          className="fixed inset-0 bg-darkgray bg-opacity-50 flex items-center justify-center z-0" 
          onClick={()=>handleClosePopup("categories")}
          style={{ zIndex: 1000 }}
        >
        <div className='flex flex-col items-end gap-2' onClick={e => e.stopPropagation()}>
            <Outlet context={{
              selectedCategoryProduct,
              setSelectedCategoryProduct, 
              setCategories,
            }}/>
          </div>
        </div>
      )}
    </div>
    <div className='flex justify-end gap-4  w-full'>
        <CreateCategory setCategories={setCategories}/>
        <DeleteButtonWithConfirm onDelete={()=>handleDeleteAllCategories()} itemName={"كل الفئات"} text="مسح كل الفئات" styling="bg-red px-4 py-2 rounded-md text-whi hover:bg-light-red transition-colors"/>

    </div>
    </div>
)
}
