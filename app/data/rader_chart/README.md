# Rader chart

A script which create chart data from game videos.


## Prerequisite

* Python 3


## Usage

0. Check ml models exist

    ```sh
    ls data/tensorflow/score_classification/model/*
    ```

1. Configure python

    Don't forget to use python 3.

    ```sh
    # An example on my local
    conda activate cv_env
    ```

2. Check the shell script

    ```sh
    ls bin/main.sh
    cat ../fumen_site/output/*.sh | grep https
    ```

    It should contain the youtube url of a track.

3. Run the shell script

    ```sh
    cd bin/
    sh main.sh
    ```
