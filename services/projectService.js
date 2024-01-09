const projectModel = require("../models/projectModel");

exports.getProjects  = async () => {
  try {
    const projects = await projectModel.find({});
    return {statusCode: 200, message: "Projects Retrived Successfully!", projects: projects}
  } catch (error) {
    console.log("Error: ", error);
    return {statusCode: 500, message: "Internal Server Error"}
  }
}

