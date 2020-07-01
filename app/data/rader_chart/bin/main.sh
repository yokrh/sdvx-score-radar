#!/usr/bin/env bash
python -V

org_shell_dir='../../fumen_site/output/'
tmp_shell_dir='tmp/'
mkdir -p ${tmp_shell_dir}

# ### level 15
shell_file='15_script.sh'
cp ${org_shell_dir}${shell_file} .
echo "copied ${org_shell_dir}${shell_file}"
sh ${shell_file}

# ### level 16
shell_file='16_script.sh'
cp ${org_shell_dir}${shell_file} .
echo "copied ${org_shell_dir}${shell_file}"
sh ${shell_file}

# ### level 17
shell_file='17_script.sh'
cp ${org_shell_dir}${shell_file} .
echo "copied ${org_shell_dir}${shell_file}"
sh ${shell_file}

# ### level 18
shell_file='18_script.sh'
cp ${org_shell_dir}${shell_file} .
echo "copied ${org_shell_dir}${shell_file}"
sh ${shell_file}

# ### level 19
shell_file='19_script.sh'
cp ${org_shell_dir}${shell_file} .
echo "copied ${org_shell_dir}${shell_file}"
sh ${shell_file}

### level 20
shell_file='20_script.sh'
cp ${org_shell_dir}${shell_file} ${tmp_shell_dir}
echo "copied ${org_shell_dir}${shell_file}"
sh ${tmp_shell_dir}${shell_file}
