import  { Dispatch, SetStateAction, useState } from 'react'
import { Customer } from '../interfaces/customer';

interface CustomerFilterInputsProp{
  setItems: Dispatch<SetStateAction<Customer[]>>,
}
export default function CustomerFilterInputs({setItems}:CustomerFilterInputsProp) {
    const [name,setName]= useState<string>("");
    const [classType,setClassType]= useState<string>("عميل عادي");
    const [phone_number,setPhoneNumber]= useState<string>("");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    return (
    <div className="flex justify-between 2xl:justify-between 2xl:flex-row xl:flex-row   xs:flex-col xs:gap-4  sm:gap-4  items-center">
    <div className='flex gap-2  '>
      <label htmlFor="name" className="text-whi">الاسم</label>
      <input type="text" id="name"  onChange={(event)=>{
        console.log(event.target.value)
        setName(event.target.value);
      }}/>
      
    </div>
    <div className='flex gap-2'>
      <label htmlFor="classType" className="text-whi">الفئة</label>
      <select id="classType" onChange={(event)=>{
        console.log(event.target.value)
        setClassType(event.target.value);
      }} >
        <option value="" defaultChecked> الكل</option>
        <option value="عميل عادي">عميل عادي</option>
        <option value="طالب">طالب</option>
        <option value="عميل مهم">عميل مهم</option>
      </select>
    </div>
    <div className='flex gap-2'>
      <label htmlFor="phoneNumber" className="text-whi">رقم العميل</label>
      <input type="phone" id="phoneNumber" onChange={(event)=>{
        console.log(event.target.value)
        setPhoneNumber(event.target.value);
      }} />
    </div>
    <button className="bg-paleOrange p-2 rounded-md" onClick={()=>{
      fetch(`${API_BASE_URL}customer/filter?${name&&`name=${name}&&`}${classType&&`class=${classType}&&`}${phone_number&&`phone_number=${phone_number}`}`,
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

    }}>استعلم عن عميل</button>
    </div>
  )
}
