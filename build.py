import os
import platform

dist_folder = 'dist'
compiled_name_uncompressed = 'uncompressed.exe' if platform.system() == 'Windows' else 'uncompressed'
compiled_name = 'multi-server-handler.exe' if platform.system() == 'Windows' else 'multi-server-handler'

if os.path.exists(os.path.join(dist_folder, compiled_name)):
    os.remove(os.path.join(dist_folder, compiled_name))

if os.path.exists(os.path.join(dist_folder, compiled_name_uncompressed)):
    os.remove(os.path.join(dist_folder, compiled_name_uncompressed))

os.system(f'nexe -i ./src/index.js -b --verbose --temp ./temp/ -o {os.path.join(dist_folder, compiled_name_uncompressed)}')
os.system(f'upx -9 -v -o {os.path.join(dist_folder, compiled_name)} {os.path.join(dist_folder, compiled_name_uncompressed)}')