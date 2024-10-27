import { useEffect, useState } from 'react'
import { Order } from '../interfaces/order';
import Table from '../components/Table';
import DateInputs from '../components/DateInputs';

export default function Returns() {
  const [returnedOrders,SetReturnedOrders]=useState<Order[]>([]);
  useEffect(
    ()=>{
      fetch("/api/order/filter?order_type=استرجاع",{
        headers:{
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
      }).then((res)=>
        res.json()).then(data=>{
          SetReturnedOrders(data.data);
          console.log(data.data);
        })
    }
  ,[])
  return (
    <div>
    <DateInputs setItems={SetReturnedOrders} type={"استرجاع"}/>
    <Table items={returnedOrders} navigation_part="returns"/>
    </div>
  )
}
