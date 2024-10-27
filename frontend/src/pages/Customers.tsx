import { useEffect, useState } from 'react'
import { Customer } from '../interfaces/customer';
import CustomerTable from '../components/CustomerTable';
import CustomerFilterInputs from '../components/CustomerFilterInputs';
interface customerResponse{
  message:string,
  data:Customer[]
}

export default function Customers() {
  const [customers,SetCustomers]=useState<Customer[]>([]);
  useEffect(
    ()=>{
      fetch("http://localhost:4000/api/customer/all",{
        headers:{
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
      }).then((res)=>
        res.json()).then((data : customerResponse)=>{
          SetCustomers(data.data)
        })
    }
  ,[])
  return (
    <div className='flex flex-col items-center'>
    <CustomerFilterInputs setItems={SetCustomers}/>
    <CustomerTable customers={customers} setCustomers={SetCustomers} />
    </div>
  )
}
