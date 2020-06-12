import cv2
import numpy as np


"""
Capture frame images from a video.
"""
def capture_video_frame(
  *,
  video_file_path, # required
  output_dir='./', # required
  output_file_prefix='out_',
  frame_step=1,
  frame_top_skip_num=0,
  frame_limit=10000
  ):
  cap = cv2.VideoCapture(video_file_path)
  frame_num = 0
  while(cap.isOpened()):
    ret, frame = cap.read()
    if ret == False:
      break

    img = frame
    h = int(img.shape[0] / 2)
    w = int(img.shape[1] / 2)
    img = cv2.resize(img, (w, h))

    if frame_num < frame_top_skip_num:
      frame_num += 1
      continue
    if frame_num > frame_limit:
      break
    if frame_num % frame_step == 0:
      file_name = output_dir + output_file_prefix + str(10000000 + frame_num) + '.png'
      cv2.imwrite(file_name, img)
    frame_num += 1
  cap.release()


"""
Trim images.

1.
Helper for calc_similarity.
Trim iamge temporarily as required in calc_similarity.

2.
Trim frame images for later concat part.
"""
def trim_image(
  *,
  img,
  h_begin=0.1,
  h_end=0.2,
  w_begin=0,
  w_end=1
  ):
  h = img.shape[0]
  w = img.shape[1]

  hb = int (h_begin * h)
  he = int (h_end * h)
  wb = int (w_begin * w)
  we = int (w_end * w)
  return img[hb:he, wb:we]


"""
Helper for filter_similar_image_files.
Calculate the similarity between the given image and based image.
"""
def calc_similarity(
  arg_img1,
  arg_img2,
  h_begin,
  h_end,
  w_begin,
  w_end
  ):
  img1 = trim_image(
    img=arg_img1,
    h_begin=h_begin,
    h_end=h_end,
    w_begin=w_begin,
    w_end=w_end
  )
  img2 = trim_image(
    img=arg_img2,
    h_begin=h_begin,
    h_end=h_end,
    w_begin=w_begin,
    w_end=w_end
  )

  hsv1 = cv2.cvtColor(img1, cv2.COLOR_BGR2HSV)
  hsv2 = cv2.cvtColor(img2, cv2.COLOR_BGR2HSV)

  scores, hists1, hists2 = [], [], []
  ch_names = {0: 'Hue', 1: 'Saturation', 2: 'Brightness'}
  for ch in ch_names:
    h1 = cv2.calcHist([hsv1], [ch], None, histSize=[256], ranges=[0, 256])
    h2 = cv2.calcHist([hsv2], [ch], None, histSize=[256], ranges=[0, 256])
    score = cv2.compareHist(h1, h2, cv2.HISTCMP_CORREL)
    hists1.append(h1)
    hists2.append(h2)
    scores.append(score)
  similarity_score = (scores[0] + scores[1] + scores[2]) / 3
  return similarity_score


"""
Filter to get only target images, which is considered as on playing.
"""
def filter_similar_image_files(
  *,
  based_image_files,
  image_files,
  h_begin,
  h_end,
  w_begin,
  w_end,
  minimum_rate
  ):
  is_playing_area_begin = 0
  is_playing_area_end = 0
  for index, file in enumerate(image_files):
    img = cv2.imread(file, 1)
    similarity_score = 0
    for based_image_file in based_image_files:
      based_img = cv2.imread(based_image_file, 1)
      similarity_score = max(
        similarity_score,
        calc_similarity(
          based_img,
          img,
          h_begin,
          h_end,
          w_begin,
          w_end
        )
      )
      if similarity_score > minimum_rate:
        break
    if similarity_score > minimum_rate:
      if (is_playing_area_begin == 0):
        is_playing_area_begin = index
      is_playing_area_end = index
  return image_files[is_playing_area_begin:is_playing_area_end]


"""
Adjust trimmed frame images as pre-process, especially removing dusts on images.
ref: https://stackoverflow.com/questions/10948589/choosing-the-correct-upper-and-lower-hsv-boundaries-for-color-detection-withcv
"""
def adjust_color_to_black(img, hsv_min=(25,40,0), hsv_max=(50,255,200), black=0):
  hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
  mask = cv2.inRange(
      hsv,
      np.array(hsv_min, np.uint8),
      np.array(hsv_max, np.uint8)
  )
  inv_mask = cv2.bitwise_not(mask)
  black_full = np.full(img.shape, black, dtype=img.dtype)
  background = cv2.bitwise_and(black_full, black_full, mask=mask)
  extracted = cv2.bitwise_and(img, img, mask=inv_mask)
  return cv2.add(extracted, background)
def adjust_dark_red_to_black(img):
  hsv_min=(140,60,0)
  hsv_max=(160,255,140)
  return adjust_color_to_black(img, hsv_min, hsv_max)
def adjust_dark_blue_to_black(img):
  hsv_min=(80,60,0)
  hsv_max=(100,255,80)
  return adjust_color_to_black(img, hsv_min, hsv_max)
def adjust_dark_yellow_to_black(img):
  hsv_min=(25,60,0)
  hsv_max=(50,255,140)
  return adjust_color_to_black(img, hsv_min, hsv_max)
def adjust(
  *,
  img
  ):
  img = adjust_dark_red_to_black(img)
  img = adjust_dark_blue_to_black(img)
  img = adjust_dark_yellow_to_black(img)
  return img


"""
Concat trimmed adjusted frame images vertically.
"""
def vconcat_all(image_files, h_duplicate = 4):
  img_all = cv2.imread(image_files[0], 1)
  image_files.pop(0)
  for file in image_files:
    img = cv2.imread(file, 1)
    h, w = img.shape[0], img.shape[1]

    tmp_img_all = img_all
    h_all, w_all = tmp_img_all.shape[0], tmp_img_all.shape[1]

    duplicate_area_src1 = tmp_img_all[h_all - h_duplicate:h_all, 0:w]
    duplicate_area_src2 = img[0:h_duplicate, 0:w]
    duplicate_area = cv2.addWeighted(
      src1=duplicate_area_src1,
      alpha=0.8,
      src2=duplicate_area_src2,
      beta=0.8,
      gamma=0
    )

    tmp_img_all_without_duplicate_area = tmp_img_all[0:h_all - h_duplicate, 0:w]
    img_without_duplicate_area = img[h_duplicate:h, 0:w]

    tmp_img_all = tmp_img_all_without_duplicate_area
    tmp_img_all = cv2.vconcat([tmp_img_all, duplicate_area])
    tmp_img_all = cv2.vconcat([tmp_img_all, img_without_duplicate_area])

    img_all = tmp_img_all
  return img_all
