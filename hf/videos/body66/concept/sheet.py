import sys
from PIL import Image
n=sys.argv[1]; ts=[float(x) for x in sys.argv[2:]]
ims=[Image.open(f'{n}_t{t:.2f}.jpg') for t in ts]
o=Image.new('RGB',(len(ims)*360,640));[o.paste(im.resize((360,640)),(i*360,0)) for i,im in enumerate(ims)];o.save(f'sheet_{n}.jpg')
