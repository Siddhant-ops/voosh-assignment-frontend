import { API_URL } from "./constants";

export const makeReq = async (apiURL, method, body, token) => {
  if (!method) method = "POST";
  try {
    const response = await fetch(`${API_URL}/api/${apiURL}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body) ?? undefined,
    });

    const res = await response.json();

    return { response, res };
  } catch (error) {
    return { error: error.message };
  }
};

export const handleResponse = (resObj, enqueueSnackbar) => {
  if (!resObj) {
    enqueueSnackbar("Please try again later", { variant: "error" });
    return null;
  }

  if (resObj?.error) {
    enqueueSnackbar(
      resObj.error.toString() ?? "Error : Please try again later",
      { variant: "error" }
    );
    return null;
  }

  if (resObj.res?.error) {
    if (Array.isArray(resObj.res?.error)) {
      const messageArr = resObj.res?.error.filter((values) => values !== null);
      messageArr.forEach((message) => {
        enqueueSnackbar(`${message.param} : ${message?.msg}`, {
          variant: "error",
        });
      });
      return null;
    }

    if (typeof resObj.res?.error === "string") {
      enqueueSnackbar(resObj.res?.error ?? "Error : Please try again later", {
        variant: "error",
      });
      return null;
    }
  }

  if (resObj.res.message) {
    enqueueSnackbar(
      resObj.res.message.toString() ?? "Message : Please try again later",
      { variant: resObj.response?.status === 200 ? "success" : "warning" }
    );
    return resObj.res?.data ?? null;
  }

  if (resObj.response && resObj.response.ok) {
    return resObj.res?.data;
  }

  enqueueSnackbar("Something went wrong", { variant: "warning" });
  return null;
};
