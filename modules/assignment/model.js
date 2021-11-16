const {info, success, error} = require('consola')
const assignmentModel = require('./schema')

exports.add = async (body) => {
  try {
      let create = await assignmentModel.create(body)
      return create
  } catch (err) {
    error({ message: err.message, badge: true })
    return err
  }
};

  exports.find = async () => {
    try {
        // info({message: body, badge: true})
        let find = await assignmentModel.find({})
        return find
    } catch (err) {
      error({ message: err.message, badge: true })
      return err
    }
  };

  exports.findOne = async (body) => {
    try {
        // info({message: body, badge: true})
        let findOne = await assignmentModel.findOne({id: body.id})
        return findOne
    } catch (err) {
      error({ message: err.message, badge: true })
      return err
    }
  };

  exports.update = async (body) => {
    try {
        // info({message: body, badge: true})
        let assignment = await assignmentModel.findOne({id: body.id})
        assignment.description = ''
        assignment.submissionLink = ''
        assignment.deadline = ''
        assignment.track = ''
        assignment.teacher = ''
        let update = await assignment.save()
        if(!update){
          console.log('Assignment could not be saved')
          return false
        }
        return update
    } catch (err) {
      error({ message: err.message, badge: true })
      return err
    }
  };

  exports.delete = async (body) => {
    try {
        // info({message: body, badge: true})
        let deleteAssignment = await assignmentModel.deleteOne({id: body.id})
    } catch (err) {
      error({ message: err.message, badge: true })
      return err
    }
  };