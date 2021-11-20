
const { gradeModel } = require("./schema");
const { userModel, profileModel } = require("../admin/schema");

console.log(userModel);

exports.gradeStudent = async (body) => {
  let id = { _id: req.query.userId };
  console.log("grade student");
  let user = userModel.findOne({ id: body.id });

};

exports.promoteStudent = async (id) => {
  console.log("promote student");
  let student = await userModel.findOne({ _id: id });
  if(student) {
    console.log(student)
     student.stage = student.stage + 1
    await student.save()
    console.log(student.stage)
    return student
  }
  else return false
};

exports.demoteStudent = async (id) => {
  let student = await userModel.findOne({ _id: id });
  if(student) {
    console.log(student)
     student.stage = student.stage == 1 ? 1: (student.stage - 1)
    await student.save()
    console.log(student.stage)
    return student
  }
  else return false
};

exports.viewStudent = async () => {
  let students = await userModel.find({});
  let fetch = students.map(student => {
      let data = {
        id: student._id,
        name: student.name,
        email: student.email,
        stage: student.stage,
      };
      return data
  })
  console.log("view students");
  return fetch
};

