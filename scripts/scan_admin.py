import re

with open('g:/KDDT/website/admin/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

with open('g:/KDDT/website/test_admin_sections.txt', 'w', encoding='utf-8') as fw:
    for m in re.finditer(r'(function \w+)', c):
        fw.write(c[m.start():m.start()+60] + '\n')

print('total length:', len(c))
print('done')
