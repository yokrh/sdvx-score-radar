# Dev memo

## TODO

1. apiをcloud runに

    1. image作成

        Dockerfile修正してイメージup

    2. terraform

        https://github.com/yokrh/cloud-run-training/blob/beff545b0e0d31ebea736a695024d2db7522149d/infra/tf/main.tf

2. frontをnetlifyに

    使ったことないので使ってみる


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

### Tensorflow model saving format

* .h5

    Used by Keras.
    https://www.tensorflow.org/guide/keras/save_and_serialize#whole-model_saving

* .hdf5 (or .h5):

    Used by Tensorflow.
    A common format (https://support.hdfgroup.org/products/java/release/download.html)
    directory containing assets and variables

Both seem OK.
