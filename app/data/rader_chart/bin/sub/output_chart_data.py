import json
import fnmatch
import os
import codecs


"""
Create rader chart json data of a track.

Parameters
----------
name : string
level : string
difficulty : string
prediction_dir : string
output_dir : string
"""
def create_chart_data(
  *,
  name,
  level,
  difficulty,
  prediction_dir,
  output_dir
  ):
  bt_long = fnmatch.filter(
    os.listdir(os.path.join(prediction_dir, 'label_btn', 'btn_bt_long', '1')),
    '*.png'
  )
  douji = fnmatch.filter(
    os.listdir(os.path.join(prediction_dir, 'label_btn', 'btn_douji', '1')),
    '*.png'
  )
  niju = fnmatch.filter(
    os.listdir(os.path.join(prediction_dir, 'label_btn', 'btn_niju', '1')),
    '*.png'
  )
  tateren = fnmatch.filter(
    os.listdir(os.path.join(prediction_dir, 'label_btn', 'btn_tateren', '1')),
    '*.png'
  )
  trill = fnmatch.filter(
    os.listdir(os.path.join(prediction_dir, 'label_btn', 'btn_trill', '1')),
    '*.png'
  )

  # tsumami = fnmatch.filter(
  #   os.listdir(os.path.join(prediction_dir, 'label_vol', 'vol_xxx', '1')),
  #   '*.png'
  # )
  # chokkaku_simple = fnmatch.filter(
  #   os.listdir(os.path.join(prediction_dir, 'label_vol', 'vol_xxx', '1')),
  #   '*.png'
  # )
  # chokkaku_complex = fnmatch.filter(
  #   os.listdir(os.path.join(prediction_dir, 'label_vol', 'vol_xxx', '1')),
  #   '*.png'
  # )
  # katate = fnmatch.filter(
  #   os.listdir(os.path.join(prediction_dir, 'label_vol', 'vol_xxx', '1')),
  #   '*.png'
  # )

  json_data = json.dumps(
    {
      'name': name,
      'level': level,
      'difficulty': difficulty,
      'bt_long': len(bt_long),
      'douji': len(douji),
      'niju': len(niju),
      'tateren': len(tateren),
      'trill': len(trill) #,
      # 'tsumami': len(tsumami),
      # 'chokkaku_simple': len(chokkaku_simple),
      # 'chokkaku_complex': len(chokkaku_complex),
      # 'katate': len(katate)
    },
    indent=2,
    ensure_ascii=False
  )

  cmd = 'mkdir -p ' + output_dir
  os.popen(cmd).read()

  filename = output_dir + '/' + level + '_' + difficulty + '_' + name + '.json'
  print('output filename:')
  print(filename)
  with open(filename, 'w') as f:
    f.write(json_data + '\n')
