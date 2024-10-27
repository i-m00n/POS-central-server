import  { useEffect, useState } from 'react'
import { Order } from '../interfaces/order';
import Table from '../components/Table';
import DateInputs from '../components/DateInputs';

export default function Sales() {
  const [soldOrders,SetSoldOrders]=useState<Order[]>([]);
  useEffect(
    ()=>{
      fetch("http://localhost:4000/api/order/filter?order_type=بيع",
        {
          headers:{
            "Content-type":"application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,

          }
        }
      ).then((res)=>
        res.json()).then(data=>{
          SetSoldOrders(data.data);
          console.log(data.data);
        })
    }
  ,[])
  return (
    <div>
    <DateInputs setItems={SetSoldOrders} type={"بيع"}/>
    <Table items={soldOrders} navigation_part="sales"/>
    </div>
  )
}
