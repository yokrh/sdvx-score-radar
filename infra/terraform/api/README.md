# Infra of api

構築はTerraform。同時に権限周りも設定したいから。
あと、`tf destroy`できる状況にしたいから

ただし、Cloud Run内のcontainer image更新は
`app/api/server/cloud-build.yml` での管理にしている。
terraformによるcontainer image更新時にはlatestタグで検知がスルーされるから。

* GCP web console

    https://console.cloud.google.com/run/detail/asia-northeast1/api-server/revisions?project=sdvx-score-rader


## Issue

### Access control

IPやドメインで制御するのは無理そう。

https://stackoverflow.com/questions/56763967/what-are-the-outbound-ip-ranges-for-gcp-managed-cloud-run

### Update the container image in Cloud Run

latestタグだと、新しいcontainer imageをregistoryにpushしてCloud Run更新しようとしてもされない。
Terraformからではなく、gcloudのコマンドならやりようはあるみたい。

https://stackoverflow.com/questions/56919391/is-there-a-way-to-set-imagepullpolicy-for-cloud-run-service

めんどうなので、Cloud BuildのCloud Run連携をGCPのwebコンソールからする方針にした。

https://cloud.google.com/run/docs/continuous-deployment-with-cloud-build


### Cloud Run domain mapping

設定できない。Cloud Run domain mappingの問題なのか、Cloud DNSの問題なのか、
Google Domainsで買った.appドメインの問題なのか、結局原因は分からず。

以下、試したこと。

* 公式のチュートリアル

    https://cloud.google.com/run/docs/mapping-custom-domains

* 記事

    https://www.apps-gcp.com/cloud-run-full-managed-basic-1/


```sh
gcloud beta run domain-mappings create --service api-server --domain cloudrun.yokrh.app --platform=managed --region=asia-northeast1
Creating......done.
Waiting for certificate provisioning. You must configure your DNS records for certificate issuance to begin.
NAME      RECORD TYPE  CONTENTS
cloudrun  CNAME        ghs.googlehosted.com.
```

CNAME設定したのに、Mapping設定画面でずっとくるくるしてる。何でだー。バグっぽい。

* https://issuetracker.google.com/issues/140611842

* https://stackoverflow.com/questions/57789565/google-cloud-run-domain-mapping-stuck-at-certificate-provisioning

ドメインの問題ではなさそう。自分のドメインの所有権は問題ないっぽい。

* DNS check

    https://toolbox.googleapps.com/apps/dig/#TXT/
