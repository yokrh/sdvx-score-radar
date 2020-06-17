## Cloud Run domain mapping

https://cloud.google.com/run/docs/mapping-custom-domains


### tst

ref: https://www.apps-gcp.com/cloud-run-full-managed-basic-1/

```sh
gcloud beta run domain-mappings create --service api-server --domain cloudrun.yokrh.app --platform=managed --region=asia-northeast1
Creating......done.
Waiting for certificate provisioning. You must configure your DNS records for certificate issuance to begin.
NAME      RECORD TYPE  CONTENTS
cloudrun  CNAME        ghs.googlehosted.com.
```

CNAME設定したのに、Mapping設定画面でずっとくるくるしてる。何でだー

バグっぽい

Issue

https://issuetracker.google.com/issues/140611842
https://stackoverflow.com/questions/57789565/google-cloud-run-domain-mapping-stuck-at-certificate-provisioning


### DNS check

no error...
https://toolbox.googleapps.com/apps/dig/#TXT/

