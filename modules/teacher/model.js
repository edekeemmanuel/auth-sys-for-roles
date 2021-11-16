const model = require('./schema')

console.log(model)

exports.gradeStudent = async (body) => {
    console.log('grade student')
}

exports.promoteStudent = async (body) => {
    console.log('promote student')
    let findStudent = await model.userModel(id)
}

exports.demoteStudent = async (body) => {
    console.log('demote student')
}