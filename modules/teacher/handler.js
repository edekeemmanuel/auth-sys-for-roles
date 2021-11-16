// const model = require('./model')

exports.promote = async (req, res) => {
  const id = {_id: req.body.id}
  let promote = await model.promoteStudent(id)
  
}

exports.demote = async (req, res) => {
  const id = {_id: req.body.id}
let promote = await model.promoteStudent(id)

}

exports.grade = async (req, res) => {
  const id = {_id: req.body.id}
  let promote = await model.gradeStudent(id)
  
}