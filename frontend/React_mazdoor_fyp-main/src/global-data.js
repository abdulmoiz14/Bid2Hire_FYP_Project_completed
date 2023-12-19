import User from "./constant";

class GlobalUser {
  constructor() {
    this.userModel = null;
  }

  setUserModel(userData) {
    this.userModel = { ...User, ...userData };
  }
}

const globalUser = new GlobalUser();

export default globalUser;
