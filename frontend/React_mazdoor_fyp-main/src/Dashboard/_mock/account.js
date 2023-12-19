// ----------------------------------------------------------------------
import globalUser from "../../global-data";
const account = {
  displayName: globalUser.userModel
    ? `${globalUser.userModel.firstName} ${globalUser.userModel.lastName}`
    : "Guest",
  email: 'demo@minimals.cc',
  photoURL: '/assets/images/avatars/avatar_default.jpg',
};

export default account;
