import { Order } from '../interfaces/order'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { Eye } from 'lucide-react'



interface tableProps{
    items:Order[],
    navigation_part:string
}
export default function Table ({items,navigation_part}:tableProps) {
    const navigate= useNavigate();
    const handleViewButton = (orderID: number,navigation_part:string) => {
        navigate(`/${navigation_part}/${orderID}`);
      }
    
      const handleClosePopup = (navigation_part:string) => {
        navigate(`/${navigation_part}`);
      }
    const params = useParams();
return (
<div className="w-fit text-center overflow-x-auto my-3 sm:my-6 rounded-md shadow-xl shadow-realyDarkGray">
      <div className="min-w-[320px]">
        <table className="w-600px text-xs sm:text-sm bg-paleBlack shadow-lg shadow-realyDarkGray text-gray-200">
          <thead className="text-[10px] sm:text-xs lg:text-base text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">رقم الطلب</th>
              <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">سعر المنتج</th>
              <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">نوع البيع</th>
              <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">نوع المعامله</th>
              <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">التاريخ</th>
              <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">رقم العميل</th>
              <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">للمعاملات</th>
            </tr>
          </thead>
          <tbody className="text-[10px] sm:text-xs lg:text-lg">
            {items?items.map((item,i) => (
              <tr key={item.id} className={`bg-white border-b ${i % 2 == 0 ? "bg-bg-color" : "bg-paleBlack"}`}>
                <th scope="row" className="px-2 py-2 sm:px-4 lg:px-6 font-medium text-gray-900 whitespace-nowrap">
                  {item.id}
                </th>
                <td className="px-2 py-2 sm:px-4 lg:px-6">{item.total_price}</td>
                <td className="px-2 py-2 sm:px-4 lg:px-6">{item.order_type}</td>
                <td className="px-2 py-2 sm:px-4 lg:px-6">{item.order_method}</td>
                <td className="px-2 py-2 sm:px-4 lg:px-6">{` ${item.date.split("T")[1].split('.')[0]} - ${item.date.split("T")[0]} `}</td>
                <td className="px-2 py-2 sm:px-4 lg:px-6">{item.customer_phone_number}</td>
                <td className="px-2 py-2 sm:px-4 lg:px-6">
                <button 
                    onClick={() => handleViewButton(item.id,navigation_part)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </td>
              </tr>
            )) : <tr>No Data</tr>}
          </tbody>
        </table>

        {/* Only added this part for the popup functionality */}
        {params.orderID && (
          <div 
            className="fixed inset-0 bg-darkgray bg-opacity-50 flex items-center justify-center" 
            onClick={()=>handleClosePopup(navigation_part)}
            style={{ zIndex: 1000 }}
          >
            <div onClick={e => e.stopPropagation()}>
              <Outlet />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
