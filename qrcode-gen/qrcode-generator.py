import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import VerticalBarsDrawer,RoundedModuleDrawer,HorizontalBarsDrawer,SquareModuleDrawer,GappedSquareModuleDrawer,CircleModuleDrawer

import time, os, datetime
img = qrcode.make('https://freetools.uk')    # 要轉換成 QRCode 的文字
img.save('qrcode-'+datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')+'.png')    # 儲存圖片


qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4
)
qr.add_data('https://freetools.uk')   # 要轉換成 QRCode 的文字
qr.make(fit=True)          # 根據參數製作為 QRCode 物件
img = qr.make_image(fill_color="red", back_color="black")      # 產生 QRCode 圖片
img.save('qrcode-'+datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')+'.png')     # 儲存圖片

img1 = qr.make_image(image_factory=StyledPilImage, module_drawer=SquareModuleDrawer())
img1.save('SquareModuleDrawer-'+datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')+'.png')