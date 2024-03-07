import { ReactElement, useEffect, useState } from "react";
import TableHOC from "../components/admin/TableHOC"
import { Column } from "react-table"; 
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { userreducertype } from "../types/reducers-types";
import toast from "react-hot-toast";
import { customerror } from "../types/api-types";
import { useMyorderQuery } from "../redux/api/orderapi";

type DataType = {
    _id: string;
    amount: number;
    quantity: number;
    discount: number;
    status: ReactElement;
    action: ReactElement;
  };
  const column: Column<DataType>[] = [
    {
      Header: "ID",
      accessor: "_id",
    },
    {
      Header: "Quantity",
      accessor: "quantity",
    },
    {
      Header: "Discount",
      accessor: "discount",
    },
    {
      Header: "Amount",
      accessor: "amount",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Action",
      accessor: "action",
    },
  ];
const Orders = () => {
  const { user } = useSelector(
    (state: { userReducer: userreducertype }) => state.userReducer);

  const {data, isError, error } = useMyorderQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) {
    const err = error as customerror;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data)
      setRows(
        data?.orders?.map((i) => ({
          _id: i._id,
          user: i.user.name,
          amount: i.total,
          discount: i.discount,
          quantity: i.orderitems.length,
          status: (
            <span
              className={
                i.status === "Processing"
                  ? "red"
                  : i.status === "Shipped"
                  ? "green"
                  : "purple"
              }
            >
              {i.status}
            </span>
          ),
          action: <Link to={`/orders/${i._id}`}>Manage</Link>,
        }))
      );
  }, [data]);
    const Table= TableHOC<DataType>(column,rows,"dashboard-product-box","Orders", rows.length>6)();
  return (
    <div className="container">
    <h1>My Orders</h1>
    {Table}
  </div>
  )
}

export default Orders