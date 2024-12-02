import  { Dispatch, SetStateAction, useState } from 'react'
import { Order } from '../interfaces/order';

interface DateInputsProp{
  setItems: Dispatch<SetStateAction<Order[]>>,
  type?:string
}
export default function DateInputs({setItems,type}:DateInputsProp) {
    const [startDate,setStartDate]= useState<Date>();
    const [endDate,setEndDate]= useState<Date>();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    return (
    <div className="flex justify-between 2xl:justify-between 2xl:flex-row xl:flex-row lg:flex-row md:flex-row xs:flex-col xs:gap-4  sm:gap-4  items-center">
    <div className='flex gap-2  '>
      <label htmlFor="firstDate" className="text-whi">التاريخ الاول</label>
      <input type="date" id="firstDate"  onChange={(event)=>{
        console.log(event.target.value)
        setStartDate(new Date(event.target.value));
      }}/>
    </div>
    <div className='flex gap-2'>
      <label htmlFor="endDate" className="text-whi">التاريخ النهائي</label>
      <input type="datetime-local" id="endDate" onChange={(event)=>{
        console.log(event.target.value)
        setEndDate(new Date(event.target.value));
      }} />
    </div>
    <button className="bg-paleOrange p-2 rounded-md" onClick={()=>{
      fetch(`${API_BASE_URL}order/filter?${type&&`order_type=${type}`}&start_date=${startDate}&end_date=${endDate}`,
        {
          headers:{
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
        }
      ).
      then((res)=>res.json()).
      then(data=>{
        console.log(data);
        setItems(data.data)
      }
      );

    }}>استعلم بالتاريخ</button>
    </div>
  )
}
