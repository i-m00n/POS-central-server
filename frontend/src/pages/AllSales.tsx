import { useEffect, useState } from "react"
import { Order } from "../interfaces/order"
import Table from "../components/Table";
import DateInputs from "../components/DateInputs";

export default function AllSales() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
 
  useEffect(() => {
    fetch("/api/order/all",
      {
       headers:{
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
        }
    )
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setAllOrders(data.data)
      })
  }, []);



  return (
    
    <div >
     <DateInputs setItems={setAllOrders} />
    <Table items={allOrders} navigation_part="all-sales"/>
    </div>  )
}