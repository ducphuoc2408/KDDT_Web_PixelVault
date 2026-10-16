with open('g:/KDDT/website/pages/account.html', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('<script>')
idx_end = c.rfind('</script>')
if idx != -1:
    with open('g:/KDDT/website/test_account_script.js', 'w', encoding='utf-8') as fw:
        fw.write(c[idx+8:idx_end])
    print("Extracted account.html script, length:", idx_end - idx)
