import React from 'react'
import { Progress } from 'semantic-ui-react'

const progressBar = ({ uploadState, percentUploaded }) => (
    uploadState && (
        <Progress
            className="progress__bar"
            percent={percentUploaded}
            progress
            indicating
            size="medium"
            inverted
        />
    )
)

export default progressBar
