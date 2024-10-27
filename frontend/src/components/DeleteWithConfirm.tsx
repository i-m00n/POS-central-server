import { Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
 interface  DeleteProp{
    onDelete?:(itemName?:string)=>void,
    itemName:string,
    text?:string,
    styling?:string
 }

const DeleteWithConfirm = ({ onDelete, itemName,text,styling }:DeleteProp) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className={styling?styling : "p-2 hover:bg-gray-100 rounded-full transition-colors"}>
          {text?text : <Trash className="w-4 h-4 text-gray-600" />}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-right'>هل انت متأكد؟</AlertDialogTitle>
          <AlertDialogDescription className='text-right'>
          لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف {itemName} نهائيًا.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>الغاء</AlertDialogCancel>
          <AlertDialogAction 
        onClick={() => onDelete?.()}
        className="bg-red hover:bg-light-red"
          >
            مسح
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWithConfirm;