if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod"); // production 상태에서는 이걸 가져오자!
} else {
  module.exports = require("./dev"); // develop 상태에서는 이걸 가져오고
}
