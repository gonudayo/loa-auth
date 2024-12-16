const axios = require("axios");

const getMemberNo = async (profileNo) => {
  try {
    const response = await axios.get(
      encodeURI("https://api.onstove.com/tm/v1/preferences/" + profileNo)
    );

    return response;
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    throw new Error("Invalid profile URL");
  }
};

module.exports = { getMemberNo };
