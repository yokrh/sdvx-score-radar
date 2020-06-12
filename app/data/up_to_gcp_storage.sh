#!/usr/bin/env bash

GCP_BUCKET_NAME='sdvx-score-rader-data'

# TRACK_FILES='rader_chart/data/tensorflow/score_classification/output/16*.json' # for dev
TRACK_FILES='rader_chart/data/tensorflow/score_classification/output/*.json'
GCP_TRACK_FILES_DIR='data/track/'

# TRACK_LIST_FILES='fumen_site/output/16.json' # for dev
TRACK_LIST_FILES='fumen_site/output/*.json'
GCP_TRACK_LIST_FILES_DIR='data/track_list/'


echo '--- upload begin ---'

command="gsutil cp ${TRACK_FILES} gs://${GCP_BUCKET_NAME}/${GCP_TRACK_FILES_DIR}"
echo "${command}"
`${command}`
echo 'done'

command="gsutil cp ${TRACK_LIST_FILES} gs://${GCP_BUCKET_NAME}/${GCP_TRACK_LIST_FILES_DIR}"
echo "${command}"
`${command}`
echo 'done'

echo '--- upload end ---'
