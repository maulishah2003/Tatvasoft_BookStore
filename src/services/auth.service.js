import request from "./requests";

// const ENDPOINT = "api/";
const ENDPOINT = "/api/user";

const login = async (data) => {
  const url = `${ENDPOINT}/login`;
  // const url = `${ENDPOINT}login`;
  return request.post(url, data).then((res) => {
    return res;
    
  });
};

const create = async (data) => {
  // const url = `${ENDPOINT}register`;
  const url = `${ENDPOINT}`;
  return request.post(url, data).then((res) => {
    return res;
  });
};
 
const authService = { 
  login,
  create,
};

export default authService;
