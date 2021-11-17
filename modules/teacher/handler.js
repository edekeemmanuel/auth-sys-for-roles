const model = require("./model");
const { log } = console;
const { error, success, info } = require("consola");

log(model);
exports.students = async (req, res) => {
  try {
    let students = await model.viewStudent();
    console.log({ students });
    if (!students)
      return res.status(404).json({ ok: false, message: "students not found" });
    return res.json({ ok: true, data: students, message: "students profile" });
  } catch (err) {
    error({ message: err.message, badge: true });
    return res.status(404).json({ ok: false, message: err.message });
  }
};

exports.promote = async (req, res) => {
  try {
    const id = { _id: req.params.id };
    let promote = await model.promoteStudent(id);
    if (promote)
      return res.json({
        ok: true,
        message: `Promoted ${promote.name} with ${promote.id} to stage ${promote.stage}`,
      });
    else return res.status(400).json({ ok: false, message: "Promotion failed" });
  } catch (err) {
    console.log(err);
  }
};

exports.demote = async (req, res) => {
  try {
    const id = { _id: req.params.id };
    let demote = await model.demoteStudent(id);
    if (demote)
      return res.json({
        ok: true,
        message: `Demoted ${promote.name} with ${promote.id} to stage ${demote.stage}`,
      });
    else return res.status(400).json({ ok: false, message: "Demotion failed" });
  } catch (err) {
    console.log(err);
  }
};

exports.grade = async (req, res) => {
  try {
    const id = { _id: req.body.id };
    let grade = await model.gradeStudent(id);
    res.json("grade");
  } catch (err) {
    console.log(err);
  }
};
