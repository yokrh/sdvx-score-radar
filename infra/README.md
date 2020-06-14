# Infrastructure memo

GCP Project
https://console.cloud.google.com/home/dashboard?hl=ja&project=sdvx-score-rader


## Create a SA manager

1. GCP web consoleからSAを作成する

    https://console.cloud.google.com/iam-admin/serviceaccounts/create?hl=ja&project=sdvx-score-rader&supportedpurview=project

    下記のロールを付与する。

    * SA管理者
    * SAキー管理者
    * Project IAM管理者

2. キー（Credentialsファイル）をダウンロードして、ローカルの適当なディレクトリに置く

3. APIをプロジェクト内で有効にしておく

    有効にしないと、terraform apply時に注意される。

    * IAM

        https://console.developers.google.com/apis/api/iam.googleapis.com/overview?project=sdvx-score-rader

    * Resources

        https://console.developers.google.com/apis/library/cloudresourcemanager.googleapis.com?project=sdvx-score-rader
