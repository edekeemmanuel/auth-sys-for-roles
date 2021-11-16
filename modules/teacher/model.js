const schema = require('./schema')

console.log(schema)

exports.gradeStudent = (body) => {
    console.log('grade student')
}

exports.promoteStudent = (body) => {
    console.log('promote student')
}

exports.demoteStudent = (body) => {
    console.log('demote student')
}