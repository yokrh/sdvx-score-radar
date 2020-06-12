import os


"""
Create directories.
"""
def prepare_directory(
  *,
  video_file_dir, # required
  frame_image_dir, # required
  target_frame_image_dir, # required
  trimmed_image_dir, # required
  adjusted_image_dir, # required
  concated_image_dir # required
  ):
  cmd = 'mkdir -p ' + video_file_dir
  os.popen(cmd).read()
  cmd = 'mkdir -p ' + frame_image_dir
  os.popen(cmd).read()
  cmd = 'mkdir -p ' + target_frame_image_dir
  os.popen(cmd).read()
  cmd = 'mkdir -p ' + trimmed_image_dir
  os.popen(cmd).read()
  cmd = 'mkdir -p ' + adjusted_image_dir
  os.popen(cmd).read()
  cmd = 'mkdir -p ' + concated_image_dir
  os.popen(cmd).read()


"""
Download a video.
"""
def download_video(
  *,
  video_file_dir, # required
  youtube_url, # required
  ):
  cmd = './youtube-dl '+ youtube_url +' -f mp4 -k'
  output = os.popen(cmd).read()
  print(output)
  cmd = 'mv *.mp4 ' + video_file_dir
  os.popen(cmd).read()
  cmd = 'ls -ltr ' + video_file_dir
  output = os.popen(cmd).read()
  print(output)
