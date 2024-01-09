const accountModel = require("../models/accountModel");

class AccountService {
  async createAccount(name, hiddenOnUI, customerRefId, autoFuel) {
    try {
      if (!name || typeof hiddenOnUI !== "boolean" || !customerRefId || typeof autoFuel !== "boolean") {
        throw new Error("Invalid data format");
      }

      const newAccount = {
        name,
        hiddenOnUI,
        customerRefId,
        autoFuel,
      };

      const insertedAccount = await accountModel.create(newAccount);

      return insertedAccount;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }
}

module.exports = new AccountService();
