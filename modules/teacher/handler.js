const model = require('./model')
const {log} = console

log(model)
exports.promote = async (req, res) => {
  try{
    const id = {_id: req.body.id}
    let promote = await model.promoteStudent(id)
    res.json('promote')
  }catch(err){
    console.log(err)
  }
  
}

exports.demote = async (req, res) => {
  try{
    const id = {_id: req.body.id}
    let demote = await model.demoteStudent(id)
    res.json('demote')
  }catch(err){
    console.log(err)
  }
}

exports.grade = async (req, res) => {
  try{
    const id = {_id: req.body.id}
    let grade = await model.gradeStudent(id)
    res.json('grade')
  }catch(err){
    console.log(err)
  }
}