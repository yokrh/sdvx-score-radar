# Score data

The data for sdvx score rader app.

## Production

* GCP Storage

    https://console.cloud.google.com/storage/browser?hl=ja&project=sdvx-score-rader


## Data upload to GCP Storage

アップロード仕方めも

### Prerequisite

* gsutil

    gcloudインストール時についてきてる。
    https://cloud.google.com/storage/docs/gsutil_install?hl=ja

    プロビジョニングもgloud設定時に完了してるはず。

### Command

```sh
sh up_to_gcp_storage.sh
```
