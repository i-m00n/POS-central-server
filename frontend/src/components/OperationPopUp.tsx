import  { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { OperationResponseDTO } from '../interfaces/order'
import { X } from 'lucide-react'
interface OperationProp{
  navigation_part:string
}
export default function OperationPopUp({navigation_part}:OperationProp) {
  const params = useParams();
  const navigate = useNavigate();
  const [operations, setOperations] = useState<OperationResponseDTO[]>([]);

  useEffect(() => {
    if (params.orderID)
      fetch(`/api/operation/${params.orderID}`,
    {
      headers:{
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`

      }
    })
        .then(res => res.json())
        .then(data => {
          setOperations(data.data)
          console.log(data.data);
        })
  }, [params.orderID])

  return (
    <div className="bg-gray-100 rounded-lg shadow-xl p-4 max-w-[90vw] max-h-[90vh] overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold ">Order Details</h2>
        <button 
          onClick={() => navigate(`/${navigation_part}`)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <table className="w-full text-xs sm:text-sm bg-white shadow-lg text-gray-700">
        <thead className="text-[10px] sm:text-xs lg:text-base uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">اسم المنتج</th>
            <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">سعر المنتج</th>
            <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">كمية المنتج</th>
          </tr>
        </thead>
        <tbody className="text-[10px] sm:text-xs lg:text-lg">
          {operations.map((item,i) => (
            <tr key={item.product_name} className={`border-b ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
              <th scope="row" className="px-2 py-2 sm:px-4 lg:px-6 font-medium text-gray-900 whitespace-nowrap">
                {item.product_name}
              </th>
              <td className="px-2 py-2 sm:px-4 lg:px-6">{item.totalPrice}</td>
              <td className="px-2 py-2 sm:px-4 lg:px-6">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}