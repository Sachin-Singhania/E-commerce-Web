import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { userreducertype } from "../../types/reducers-types";
import { useAllorderQuery } from "../../redux/api/orderapi";
import { customerror } from "../../types/api-types";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
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

const Transaction = () => {
  const { user } = useSelector(
    (state: { userReducer: userreducertype }) => state.userReducer);

  const { isLoading, data, isError, error } = useAllorderQuery(user?._id!);
  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) {
    const err = error as customerror;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data)
      setRows(
        data?.orders?.map((i) => ({
          user: i.user.name!,
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
          action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>,
        }))
      );
  }, [data]);
  // const Table=  "hellp";
const Table = TableHOC<DataType>(
  columns,
  rows,
  "dashboard-product-box",
  "Transactions",
  rows?.length > 6
)();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <div>Loading...</div> : Table}</main>
    </div>
  );
};

export default Transaction;