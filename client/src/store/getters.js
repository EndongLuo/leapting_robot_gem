const getters = {
  token: state => state.user.token,
  roles: state => state.user.accountInfo.role,
  uid: state => state.user.accountInfo.result.id,
  baseRoute: state => state.permission.routes
};
export default getters;
