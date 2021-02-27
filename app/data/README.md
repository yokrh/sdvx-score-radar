# Score data

The data for sdvx score rader app.

## Production

* GCP Storage

    https://console.cloud.google.com/storage/browser?hl=ja&project=sdvx-score-rader


## Update prod data

1. Update fumen site track data

    See fumen_site/README.md

2. Update rader chat data

    See rader_chart/README.md

3. Upload the data

    See below


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

### Trouble shooting

```sh
# Check config
gcloud config list
# Login if not
gcloud auth login
# Check gsutil works
gsutil ls
```