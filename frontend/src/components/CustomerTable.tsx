import { Dispatch, SetStateAction } from 'react'
import { Customer } from '../interfaces/customer';
import EditCustomerDialog from './editCustomers';
import DeleteWithConfirm from './DeleteWithConfirm';
import CreateCustomerDialog from './createCustomers';
interface customerTableProps{
    customers:Customer[],
    setCustomers: Dispatch<SetStateAction<Customer[]>>
}
export default function CustomerTable({customers,setCustomers}:customerTableProps) {
  const handleDeleteCustomer = (name:string)=>{
      fetch(`/api/customer?name=${name}`,
        {
          method:"DELETE",
          headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
        }
      ).then(res=>res.json()).then((data)=>{
        console.log(data);
        setCustomers(customers=> customers.filter(customer=>customer.name !==name));
      })
  }
  const handleDeleteAllCustomers= ()=>{
    fetch(`/api/customer/all`,
    {
      method:"DELETE",
      headers:{
        "Content-Type":"application/json",
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`

      }
    }
    ).then(res=>res.json()).then(data=>{
      console.log(data);
      setCustomers([]);
    }
    )
  }

return (
  <>
<div className="w-fit text-center overflow-x-auto my-3 sm:my-6 rounded-md shadow-xl shadow-realyDarkGray">
      <div>
        <table className="w-600px text-xs sm:text-sm bg-paleBlack shadow-lg shadow-realyDarkGray text-gray-200">
          <thead className="text-[10px] sm:text-xs lg:text-base text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">اسم العميل</th>
              <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">رقم العميل</th>
              <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">كل السعر المدفوع</th>
              <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">فئة العميل</th>
              <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">مسح عميل</th>
              <th scope="col" className="px-2 py-2 sm:px-4 lg:px-6">التعديل في عميل</th>
            </tr>
          </thead>
          <tbody className="text-[10px] sm:text-xs lg:text-lg">
            {customers ? customers.map((item,i) => (
              <tr key={i} className={`bg-white border-b ${i % 2 == 0 ? "bg-bg-color" : "bg-paleBlack"}`}>
                <th scope="row" className="px-2 py-2 sm:px-4 lg:px-6 font-medium text-gray-900 whitespace-nowrap">
                  {item.name}
                </th>
                <td className="px-2 py-2 sm:px-4 lg:px-6">{item.phone_number}</td>
                <td className="px-2 py-2 sm:px-4 lg:px-6">{item.total_paid}</td>
                <td className="px-2 py-2 sm:px-4 lg:px-6">{item.class}</td>
                <td className="px-2 py-2 sm:px-4 lg:px-6">

                  <DeleteWithConfirm onDelete={()=>handleDeleteCustomer(item.name)} itemName={item.name}/>
                </td>
                <td className="px-2 py-2 sm:px-4 lg:px-6">
                  <EditCustomerDialog customer={item} setCustomers={setCustomers}/>
                </td>
              </tr>
            )) : 
            <tr className=''>
              <h1 className='text-center'>لا يوجد بيانات</h1>
              </tr>}
          </tbody>
        </table>
      </div>
    </div>
    <div className='flex justify-end w-full gap-4'>
    <CreateCustomerDialog setCustomers={setCustomers}/>
    <DeleteWithConfirm onDelete={()=>handleDeleteAllCustomers()} itemName={"مسح كل العملاء"} text="مسح كل العملاء" styling={"bg-red px-4 py-2 rounded-md text-whi hover:bg-light-red transition-colors"} />
    </div>
    </>
  )
}