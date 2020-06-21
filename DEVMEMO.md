# Dev memo

開発用メモ。


## Idea

### NetlifyのIaC

* Terraform

    https://www.terraform.io/docs/providers/netlify/index.html

base_urlまわりがうまくいかない。サンプルもなくて分からん。やめた。

```sh
An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # netlify_site.main will be created
  + resource "netlify_site" "main" {
    ...
    }

Plan: 1 to add, 0 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

netlify_site.main: Creating...

Error: Post https:///app/front/sites: http: no Host in request URL

  on main.tf line 17, in resource "netlify_site" "main":
  17: resource "netlify_site" "main" {
```

### data update自動化

Cloud Runに乗っけてクーロンできたら毎週とかしてもいいかも。
frontにある最終更新日、notificationとかも考慮していいかも。

### PCA

楽曲間の類似度とか出したらいいかも。

https://github.com/bitanath/pca
https://qiita.com/TomHortons/items/2064870af3f3f7f2b209

### Google map

楽曲を地球にマッピング。と思ったけれど、Google map有料か。

https://cloud.google.com/maps-platform/pricing/sheet/?hl=ja
https://developers.google.com/maps/gmp-get-started
https://qiita.com/YutaSaito1991/items/ec0c089d354ec9b8a7e0

### GCP Cloud armor

IP制限やDDoS対策をしてくれるらしい。趣味プロにはちょっと高い
https://cloud.google.com/armor/
