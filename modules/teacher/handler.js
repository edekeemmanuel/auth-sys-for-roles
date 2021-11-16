const model = require('./model')

exports.promote = async (req, res) => {
  const id = {_id: req.body.id}
  promoteStudent(id)

}

exports.demote = async (req, res) => {

}