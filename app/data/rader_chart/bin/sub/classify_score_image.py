import os
import glob
import numpy as np
import PIL.Image as Image
import tensorflow as tf


"""
Model import and image classification.

Parameters
----------
base_dir_name : string
image_dir : string
model_dir_name : string
prediction_dir_name : string
label_group_name : string
label_name : string
image_height : int
image_width : int
class_num: int
"""
def image_classification(
  *,
  base_dir_name,
  image_dir,
  model_dir,
  prediction_dir,
  label_group_name,
  label_name,
  image_height=120,
  image_width=120,
  class_num=2
  ):
  # get images
  image_shape = (image_height, image_width)
  image_files = glob.glob(image_dir + '/*.png')
  image_files = sorted(image_files, reverse=False)
  print('image_files length: ' + str(len(image_files)))

  # import model
  imported_model_parent_dir = os.path.join(
    model_dir,
    label_group_name, 
    label_name)
  dirs = os.listdir(imported_model_parent_dir)
  dirs = list(filter(lambda d: d != '.DS_Store', dirs))
  if len(dirs) == 0:
    print('no model found')
    print(model_parent__dir)
    print('Terminate.')
    print()
    return
  imported_model_dir = os.path.join(imported_model_parent_dir, dirs[0])
  model = tf.keras.models.load_model(imported_model_dir)
  print('imported model: ' + imported_model_dir)

  # prepare prediction result dir
  exported_prediction_dir = os.path.join(
    prediction_dir,
    label_group_name,
    label_name)
  cmd = 'rm -rf ' + exported_prediction_dir + 'mkdir -p ' + exported_prediction_dir
  output = os.popen(cmd).read()
  for i in range(class_num):
    cmd = 'mkdir -p ' + exported_prediction_dir + '/' + str(i)
    output = os.popen(cmd).read()
  cmd = 'ls -ltr ' + exported_prediction_dir
  output = os.popen(cmd).read()
  print(output)

  for file in image_files:
    image = Image.open(file).resize(image_shape)
    image = np.array(image)/255.0
    image_batch = image[np.newaxis, ...]
    class_id = str(np.argmax(model.predict(image_batch)))
    # print(file + ': ' + class_id)
    cmd = 'cp ' + file + ' ' + exported_prediction_dir + '/' + class_id
    os.popen(cmd).read()
