import re

c = open('g:/KDDT/website/pages/checkout.html', encoding='utf-8').read()
idx = c.lower().find('voucher')
if idx == -1: idx = c.lower().find('discount')
if idx == -1: idx = c.lower().find('coupon')
if idx != -1:
    with open('g:/KDDT/website/test_voucher.txt', 'w', encoding='utf-8') as f:
        f.write(c[max(0, idx-500):idx+500])
