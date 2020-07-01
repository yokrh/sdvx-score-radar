import sys
import os
import glob
import cv2
import time
from sub import image_process_helper
from sub import create_score_image
from sub import classify_score_image
from sub import output_chart_data


"""
This file creates a rader chart json data file from a game movie in youtube.

Usage
  For example,
  python all.py https://www.youtube.com/watch?v=bKpttJhi1Ps 5 18 mxm black_lotus

Parameters
----------
youtube_url : string
  Url of the game movie.
track_game_title_version : string
  The title version in the game movie. It should be '5' currently.
track_level : string
  For example, '18'.
track_difficulty : string
  For example, 'mxm'.
track_name : string
  Cannot contain some charactor such as space
  because it's used for directory name and file name.
  For example, 'hogehoge_nya'.
"""

is_production = True

is_enabled_additional_concated_images = is_production


print('Start to execute all.py ...')
print()

if __name__ == "__main__":

  ### check args
  args = sys.argv
  print(args)
  print()
  if len(args) < 6:
    print('Args are too short.')
    print('Terminate.')
    print()
    sys.exit()

  ### get args
  youtube_url = args[1] # 'https://www.youtube.com/watch?v=N3strD9tBgw'
  track_game_title_version = args[2] # '5'
  track_level = args[3] # '18'
  track_difficulty = args[4] # 'mxm'
  track_name = args[5] # 'black_lotus'
  print('youtube_url: ' + youtube_url)
  print('track_game_title_version: ' + track_game_title_version)
  print('track_level: ' + track_level)
  print('track_difficulty: ' + track_difficulty)
  print('track_name: ' + track_name)
  print()


  # Image processing with OpenCV

  ### set vars
  video_file_base_dir = '../data/opencv/mov/track/'
  video_file_dir = os.path.join(
    video_file_base_dir,
    track_game_title_version,
    track_level,
    track_difficulty,
    track_name
  )
  frame_image_dir = os.path.join(video_file_dir, 'frame/')
  target_frame_image_dir = os.path.join(video_file_dir, 'target_frame/')
  trimmed_image_dir = os.path.join(video_file_dir, 'trim/')
  adjusted_image_dir = os.path.join(video_file_dir, 'adjust/')
  concated_image_dir = os.path.join(video_file_dir, 'concat/')
  print('video_file_dir: ' + video_file_dir)
  print()

  ### prepare directories
  print('--- begin --- :: prepare directory')
  image_process_helper.prepare_directory(
    video_file_dir=video_file_dir,
    frame_image_dir=frame_image_dir,
    target_frame_image_dir=target_frame_image_dir,
    trimmed_image_dir=trimmed_image_dir,
    adjusted_image_dir=adjusted_image_dir,
    concated_image_dir=concated_image_dir
  )
  print('--- done ---')
  print()

  has_video = len(glob.glob(video_file_dir + '/' + '*.mp4')) > 0
  if has_video:
    print('skipped download a video')
    print()
  else:
    ### download a video
    print('--- begin --- :: download')
    image_process_helper.download_video(
      video_file_dir=video_file_dir,
      youtube_url=youtube_url
    )
    print('--- done ---')
    print()

  has_concated_images = len(glob.glob(concated_image_dir + '/' + '*.png')) > 0 # False # (for debug)
  if has_concated_images or (is_production and has_video):
    print('skipped image processing')
    print()
  else:
    ### capture frame images
    print('--- begin --- :: capture')
    create_score_image.capture_video_frame(
      video_file_path=glob.glob(video_file_dir + '/' + '*.mp4')[0],
      output_dir=frame_image_dir
    )
    print('--- done ---')
    print()

    ### filter frame images
    print('--- begin --- :: filter')
    based_frame_image_files = glob.glob(video_file_dir + '/../../../' + '*.png')
    based_frame_image_files = sorted(based_frame_image_files, reverse=False)
    top, bottom, left, right = 0, 1, 0, 1
    minumum_similarity_rate = 0.9
    if track_game_title_version == '4':
        top, bottom, left, right = 0.7, 0.73, 0.15, 0.85
        minumum_similarity_rate = 0.98
    if track_game_title_version == '5': # some vidoes are from Konasute which is based on ver 3...
        top, bottom, left, right = 0.65, 1.0, 0.0, 1.0
        minumum_similarity_rate = 0.95
    image_files = glob.glob(frame_image_dir + '*.png')
    image_files = sorted(image_files, reverse=True)
    print('image_files length: ' + str(len(image_files)))
    target_files = create_score_image.filter_similar_image_files(
      based_image_files=based_frame_image_files,
      image_files=image_files,
      h_begin=top,
      h_end=bottom,
      w_begin=left,
      w_end=right,
      minimum_rate=minumum_similarity_rate
    )
    print('target_files length: ' + str(len(target_files)))
    for file in target_files:
      img = cv2.imread(file, 1)
      new_file = file.replace(frame_image_dir, target_frame_image_dir)
      cv2.imwrite(new_file, img)
    print('--- done ---')
    print()

    ### trim frame images
    print('--- begin --- :: trim')
    top, bottom, left, right = 0.465, 0.495, 0.25, 0.75
    if track_game_title_version == '4':
      top, bottom, left, right = 0.465, 0.495, 0.25, 0.75
    if track_game_title_version == '5':
      top, bottom, left, right = 0.47, 0.518, 0.25, 0.75
    image_files = glob.glob(target_frame_image_dir + '*.png')
    image_files = sorted(image_files, reverse=True)
    print('image_files length: ' + str(len(image_files)))
    for file in image_files:
      img = cv2.imread(file, 1)
      img = create_score_image.trim_image(
        img=img,
        h_begin=top,
        h_end=bottom,
        w_begin=left,
        w_end=right
      )
      cv2.imwrite(file.replace(target_frame_image_dir, trimmed_image_dir), img)
    print('--- done ---')
    print()

    ### adjust images
    print('--- begin --- :: adjust')
    image_files = glob.glob(trimmed_image_dir + '*.png')
    image_files = sorted(image_files, reverse=True)
    print('image_files length: ' + str(len(image_files)))
    for file in image_files:
      img = cv2.imread(file, 1)
      img = create_score_image.adjust(
        img=img
      )
      cv2.imwrite(file.replace(trimmed_image_dir, adjusted_image_dir), img)
    print('--- done ---')
    print()

    ### concat images
    print('--- begin --- :: concat')
    image_files = glob.glob(adjusted_image_dir + '*.png')
    image_files = sorted(image_files, reverse=True)
    h_duplicate = 3
    group_size = 20
    if track_game_title_version == '4':
      h_duplicate = 3
      group_size = 20
    if track_game_title_version == '5':
      h_duplicate = 5
      group_size = 15
    group_num = -(-len(image_files) // group_size)  # ceil
    print('file length: ' + str(len(image_files)))
    if is_enabled_additional_concated_images:
      for i in range(group_num):
        s = i * group_size
        t = (i + 1) * group_size
        concated_image = create_score_image.vconcat_all(image_files[s:t], h_duplicate)
        file = concated_image_dir + 'image_' + str(group_num - 1 - i) + '_1.png'
        cv2.imwrite(file, concated_image)
        if i == 0:
          continue
        s = int((i - 0.5) * group_size)
        t = int((i + 0.5) * group_size)
        concated_image = create_score_image.vconcat_all(image_files[s:t], h_duplicate)
        file = concated_image_dir + 'image_' + str(group_num - 1 - i) + '_2.png'
        cv2.imwrite(file, concated_image)
    else:
      for i in range(group_num):
        s = i * group_size
        t = (i + 1) * group_size
        concated_image = create_score_image.vconcat_all(image_files[s:t], h_duplicate)
        file = concated_image_dir + 'image_' + str(group_num - 1 - i) + '.png'
        cv2.imwrite(file, concated_image)
    print('--- done ---')
    print()


  # Data processing with Tensorflow

  ### set vars
  video_file_base_dir = '../data/opencv/mov/track/'
  video_file_dir = os.path.join(
    video_file_base_dir,
    track_game_title_version,
    track_level,
    track_difficulty,
    track_name)
  concated_image_dir = os.path.join(video_file_dir, 'concat/')
  base_dir_name = '../data/tensorflow/score_classification'
  image_dir_name = 'image'
  image_dir = os.path.join(os.getcwd(), base_dir_name, image_dir_name)
  model_dir_name = 'model'
  model_dir = os.path.join(os.getcwd(), base_dir_name, model_dir_name)
  prediction_dir_name = 'prediction'
  prediction_dir = os.path.join(os.getcwd(), base_dir_name, prediction_dir_name)
  output_dir_name = 'output'
  output_dir = os.path.join(os.getcwd(), base_dir_name, output_dir_name)
  print('concated_image_dir: ' + concated_image_dir)
  print('output_dir: ' + output_dir)
  print()

  output_file_name = output_dir + '/' + track_level + '_' + track_difficulty + '_' + track_name + '.json'
  has_output = len(glob.glob(output_file_name)) > 0 # False # (for debug)
  if has_output:
    print('skipped image classification and output')
    print()
  else:
    ### check ml model exists
    if not os.path.exists(model_dir) or len(os.listdir(model_dir)) == 0:
      print('Please check if model directory and model exist')
      print('Terminate.')
      print()
      sys.exit()

    ### prepare image files
    cmd = 'rm -rf ' + image_dir + ' && mkdir -p ' + image_dir
    os.popen(cmd).read()
    cmd = 'cp ' + concated_image_dir + '* ' + image_dir
    os.popen(cmd).read()
    cmd = ('cd ' + image_dir +
      ' && for f in * ; do mv "$f" ' +
      track_game_title_version + '_' +
      track_difficulty + '_' +
      track_name + '_"$f" ; done')
    os.popen(cmd).read()

    ### image classification
    print('--- begin --- :: classification')
    label_group_names = os.listdir(model_dir)
    label_group_names = list(
      filter(
        lambda d: os.path.isdir(os.path.join(model_dir, d)),
        label_group_names
      ))
    for label_group_name in label_group_names:
      print('>>> label_group_name: ' + label_group_name)
      print()
      label_names = os.listdir(os.path.join(model_dir, label_group_name))
      label_names = list(
        filter(
          lambda d: os.path.isdir(os.path.join(model_dir, label_group_name, d)),
          label_names
        ))
      for label_name in label_names:
        print('> label_name: ' + label_name)
        classify_score_image.image_classification(
          base_dir_name=base_dir_name,
          image_dir=image_dir,
          model_dir=model_dir,
          prediction_dir=prediction_dir,
          label_group_name=label_group_name,
          label_name=label_name,
          image_height=120,
          image_width=120,
          class_num=2
        )
    print('--- done ---')
    print()

    ### output json data
    print('--- begin --- :: create chart data')
    output_chart_data.create_chart_data(
      name=track_name,
      level=track_level,
      difficulty=track_difficulty,
      prediction_dir=prediction_dir,
      output_dir=output_dir
    )
    print('--- done ---')

print()
print('Finished all.py !!!')
print()
