import { useSnackbar } from "notistack";
import { useEffect, useState, createRef } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/container";
import { useAuth } from "../provider/authProvider";
import { getLocalStorage, parseJWT } from "../utils/auth.helper";
import { handleResponse, makeReq } from "../utils/db.helper";

const AddOrderModal = ({
  modalVisible,
  setOrders,
  enqueueSnackbar,
  token,
  modalOff,
}) => {
  const [amount, setAmount] = useState([0]);

  const amountRowRef = createRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resObj = await makeReq(
      "order/add-order",
      "POST",
      {
        total: amount.reduce((a, b) => parseFloat(a) + parseFloat(b), 0),
      },
      token
    );
    const res = handleResponse(resObj, enqueueSnackbar);
    if (res) {
      setOrders((prev) => [...prev, res]);
      modalOff();
      enqueueSnackbar("Order added successfully", {
        variant: "success",
      });
      return;
    }
    return;
  };

  const addRow = () => {
    setAmount((prev) => [...prev, 0]);
  };

  return (
    <div
      className={`${
        modalVisible ? "block" : "hidden"
      } fixed z-0 inset-0 overflow-y-auto`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`${
          modalVisible ? "opacity-75" : "opacity-0"
        } bg-gray-400 z-0 w-full h-full absolute transition-all duration-300 ease-in-out`}
      ></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 w-1/2 p-8 rounded-3xl opacity-100 z-10">
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-semibold" id="modal-headline">
            Add Order
          </h3>
          <button
            type="button"
            className="p-2 rounded-full focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-gray-800 focus:ring-white hover:bg-gray-50 transition-all duration-300 ease-in-out"
            onClick={modalOff}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="mt-2">
          <form onSubmit={handleSubmit}>
            <div className="mb-4" ref={amountRowRef}>
              {amount.map((amt, index) => (
                <div className="flex my-6" key={index}>
                  <div className="w-1/2 mr-2" key={index}>
                    <label
                      htmlFor="description"
                      className="block text-gray-700 text-sm font-medium mb-2"
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      id="description"
                      placeholder="Enter Description"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="w-1/2 mr-2">
                    <label
                      htmlFor="amount"
                      className="block text-gray-700 text-sm font-medium mb-2"
                    >
                      Amount
                    </label>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      placeholder="Enter Amount"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={amt}
                      onChange={(e) => {
                        const newAmount = [...amount];
                        newAmount[index] = e.target.value;
                        setAmount(newAmount);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="my-4" id="actions">
              <hr className="border-gray-300 border-1" />
              <h4 className="mt-2">
                Total is{" "}
                {amount.reduce((a, b) => parseFloat(a) + parseFloat(b), 0)}
              </h4>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={addRow}
              >
                Add Row
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { userToken } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    modalVisible: false,
    amount: "",
  });

  const handleModal = () => {
    setNewOrder((prev) => ({ ...prev, modalVisible: !prev.modalVisible }));
  };

  const getOrders = async () => {
    const token = userToken ?? getLocalStorage();
    const uuid = parseJWT(token).uuid;
    const resObj = await makeReq(
      `order/get-order?user_id=${uuid}`,
      "GET",
      undefined,
      token
    );
    const res = handleResponse(resObj, enqueueSnackbar);
    if (res) return res;
    return;
  };

  useEffect(() => {
    const token = userToken ?? getLocalStorage();
    if (token === null) navigate("/dashboard");
    getOrders().then((res) => {
      setOrders(res);
    });
  }, []);

  const parseDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const modalOff = () => {
    setNewOrder((prev) => ({ ...prev, modalVisible: false }));
  };

  return (
    <Container mainClass="h-[80vh]">
      <h1 className="text-3xl font-medium">Dashboard</h1>
      <section className="w-full bg-gray-100 rounded-md shadow-md p-4 mt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium mt-4 mb-2">Orders</h2>
          <button
            className="px-4 py-2 bg-blue-400 text-white rounded-md font-medium"
            onClick={handleModal}
          >
            Add Order
          </button>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Order Date</th>
                <th className="px-4 py-2">Order Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="border px-4 py-2">{order._id}</td>
                  <td className="border px-4 py-2">
                    {parseDate(order.createdAt)}
                  </td>
                  <td className="border px-4 py-2">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {newOrder.modalVisible && (
        <AddOrderModal
          modalVisible={newOrder.modalVisible}
          handleModal={handleModal}
          setOrders={setOrders}
          enqueueSnackbar={enqueueSnackbar}
          token={userToken ?? getLocalStorage()}
          modalOff={modalOff}
        />
      )}
    </Container>
  );
};

export default Dashboard;
