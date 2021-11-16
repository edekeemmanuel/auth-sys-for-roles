let { info } = require("consola");
const model = require("./model");
exports.create = async (req, res) => {
  try {
    let { description, deadline, track, submissionLink } = req.body;
    let assignment = { description, deadline, track, submissionLink, teacher: req.user.id };
    let create =  await model.add(assignment);
    console.log(create)
    if (!create){
      return res.status(400).json({ ok: false, message: "error while adding" });
    }
    else {
      info({ message: create, badge: true });
      res.json({ ok: true, message: "create method", data: create });
    }
  } catch (err) {
    res.json({ okay: true, message: "error @create", error: err.message });
  }
};

exports.find = async (req, res) => {
  try {
    let find = await model.find()
    if(!find){
      res.status(400).json({ok: false, message: 'assignment'})
    }
    res.json({ok: true, message: 'assignment', data: find});
  } catch (err) {
    res.json({ okay: true, message: "error @find", error: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    let find = await model.find({id: req.params.id})
    if(!find){
      res.status(400).json({ok: false, message: 'assignment'})
    }
    res.json({ok: true, message: 'assignment one', data: find});
  } catch (err) {
    res.json({ okay: true, message: "error @findOne", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let id = {_id: req.params.id}
    let update = await model.update(id)
    if(!update) {
      console.log('could not update assignment')
      res.status(400).json({ok: false, message: 'could not update'})
    }
    else {
      console.log('assignment updated')
      res.status(200).json({ok: true, message: 'assignment updated', data: update})
    }
  } catch (err) {
    res.json({ okay: true, message: "error @update", error: err.message });
    return
  }
};

exports.delete = async (req, res) => {
  try {
    let id = {_id: req.params.id}
    let deleted = await model.delete(id)
    if(!deleted) {
      console.log('could not delete assignment')
      res.status(400).json({ok: false, message: 'delete failed'})
    }
    else {
      console.log('assignment deleted')
      res.status(200).json({ok: true, message: 'assignment deleted', data: deleted})
    }
  } catch (err) {
    res.json({ okay: true, message: "error @delete", error: err.message });
  }
};
