const {gradeModel} = require('./schema')
const {userModel} = require('../admin/schema')

console.log(userModel)

exports.gradeStudent = async (body) => {
    let id = {_id: req.query.userId}
    console.log('grade student')
    let user = userModel.findOne({id: body.id})
}

exports.promoteStudent = async (body) => {
    let id = {_id: req.query.userId}
    console.log('promote student')
    let findStudent = await model.userModel(id)
}

exports.demoteStudent = async (body) => {
    let id = {_id: req.query.userId}
    console.log('demote student')
}