# Dev memo

## TODO

1. apiをcloud runに

    1. domain買う

        https://domains.google.com/m/registrar/

    2. tfでcloud runに、custom domain

        https://www.terraform.io/docs/providers/google/r/cloud_run_domain_mapping.html

    3. frontのconfigのapi部分も変更忘れずに

2. frontをnetlifyに

    使ったことないので使ってみる

    1. deploy

        frontもcustom domain

3. data update自動化

    Cloud Runに乗っけてクーロンできたら毎週とかしてもいいかも。
    frontにある最終更新日、notificationとかも考慮していいかも。


## Idea

### PCA

楽曲間の類似度とか出したらいいかも。

https://github.com/bitanath/pca
https://qiita.com/TomHortons/items/2064870af3f3f7f2b209


### Google map

楽曲を地球にマッピング。と思ったけれど、Google map有料か。

https://cloud.google.com/maps-platform/pricing/sheet/?hl=ja
https://developers.google.com/maps/gmp-get-started
https://qiita.com/YutaSaito1991/items/ec0c089d354ec9b8a7e0


## Knowhow

### GCP Cloud armor

IP制限やDDoS対策をしてくれるらしい。趣味プロにはちょっと高い
https://cloud.google.com/armor/


### Tensorflow model saving format

* .h5

    Used by Keras.
    https://www.tensorflow.org/guide/keras/save_and_serialize#whole-model_saving

* .hdf5 (or .h5):

    Used by Tensorflow.
    A common format (https://support.hdfgroup.org/products/java/release/download.html)
    directory containing assets and variables

Both seem OK.
