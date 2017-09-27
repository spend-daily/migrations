import AWS from 'aws-sdk'
import _get from 'lodash.get'

import db from './database'

const pipeline = new AWS.CodePipeline()

export default function migrate(event, context) {
  const jobId = _get(event, ['CodePipeline.job', 'id'], false)
  if (jobId) {
    console.log(`Running migrations for CodePipeline Job ${jobId}`)
  }

  function sendSuccessToPipeline(jobId, pipeline) {
    if (!jobId) {
      return
    }

    pipeline.putJobSuccessResult(
      {
        jobId
      },
      error => {
        if (error) {
          console.error('Could not emit success to the CodePipeline', error)
          context.fail(error)
        } else {
          console.log(`Emitted success to CodePipeline for job ${jobId}`)
          context.succeed()
        }
      }
    )
  }

  function sendFailureToPipeline(message) {
    if (!jobId) {
      return
    }

    pipeline.putJobFailureResult(
      {
        jobId,
        failureDetails: {
          message: JSON.toString(message),
          type: 'JobFailed',
          externalExecutionId: context.invokeid
        }
      },
      error => {
        if (error) {
          console.error('Could not emit failure to the CodePipeline', error)
          context.fail(error, message)
        } else {
          console.log(`Emitted failure to CodePipeline for job ${jobId}`)
          context.fail(message)
        }
      }
    )
  }

  db.migrate
    .latest()
    .then(() => db.migrate.currentVersion())
    .then(version => {
      console.log(`Successfully migrated to version ${version}`)
      sendSuccessToPipeline()
    })
    .catch(error => {
      console.error('Migration error', error)
      sendFailureToPipeline(error)
      db.migrate.rollback()
    })
}
