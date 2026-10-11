with open('g:/KDDT/website/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# Extract header and footer
header_end = c.find('<!-- ============ HERO SECTION ============ -->')
if header_end == -1: header_end = c.find('</nav>') + 6

footer_start = c.find('<!-- ============ FOOTER ============ -->')

header = c[:header_end]
# Fix paths in header (since trade-in.html is in pages/)
header = header.replace('href="assets/', 'href="../assets/').replace('src="assets/', 'src="../assets/')
header = header.replace('href="pages/', 'href="').replace('href="index.html"', 'href="../index.html"')

footer = c[footer_start:]
footer = footer.replace('href="assets/', 'href="../assets/').replace('src="assets/', 'src="../assets/')
footer = footer.replace('href="pages/', 'href="').replace('href="index.html"', 'href="../index.html"')

tradein_content = """
<style>
.tradein-hero {
    padding: 100px 20px 60px;
    text-align: center;
    background: radial-gradient(circle at center, rgba(212,168,67,0.1) 0%, transparent 70%);
}
.tradein-title {
    font-family: 'Outfit', sans-serif;
    font-size: 3rem;
    font-weight: 800;
    color: var(--gold-400);
    margin-bottom: 20px;
}
.tradein-subtitle {
    font-size: 1.1rem;
    color: var(--text-300);
    max-width: 600px;
    margin: 0 auto 40px;
    line-height: 1.6;
}
.tradein-container {
    max-width: 800px;
    margin: 0 auto 100px;
    padding: 0 20px;
}
.tradein-card {
    background: var(--bg-card);
    border: 1px solid var(--border-1);
    border-radius: var(--r-lg);
    padding: 40px;
    box-shadow: var(--shadow-lg);
}
.tradein-form-group {
    margin-bottom: 24px;
}
.tradein-form-group label {
    display: block;
    margin-bottom: 8px;
    color: var(--text-200);
    font-weight: 600;
}
.tradein-form-group select, .tradein-form-group input {
    width: 100%;
    padding: 14px;
    background: var(--bg-body);
    border: 1px solid var(--border-2);
    border-radius: var(--r-md);
    color: var(--text-100);
    font-size: 1rem;
    outline: none;
    transition: all var(--dur-fast);
}
.tradein-form-group select:focus, .tradein-form-group input:focus {
    border-color: var(--border-gold);
    box-shadow: 0 0 0 3px rgba(212,168,67,0.1);
}
.tradein-result {
    display: none;
    margin-top: 32px;
    padding: 24px;
    background: rgba(34,197,94,0.05);
    border: 1px solid var(--green-500);
    border-radius: var(--r-md);
    text-align: center;
    animation: fadeIn var(--dur-mid) ease-out;
}
.tradein-result h3 {
    color: var(--green-400);
    font-size: 1.25rem;
    margin-bottom: 12px;
}
.tradein-result .price {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--text-100);
    margin-bottom: 8px;
    font-family: 'Outfit', sans-serif;
}
.voucher-box {
    margin-top: 20px;
    padding: 16px;
    background: var(--bg-body);
    border: 1px dashed var(--gold-400);
    border-radius: var(--r-md);
}
.voucher-code {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--gold-400);
    letter-spacing: 2px;
    font-family: monospace;
    margin: 8px 0;
}
</style>

<div class="tradein-hero">
    <h1 class="tradein-title">Thu Cũ Đổi Mới</h1>
    <p class="tradein-subtitle">Nâng cấp thiết bị nhiếp ảnh của bạn dễ dàng hơn bao giờ hết. Định giá ngay thiết bị cũ và nhận voucher ưu đãi đặc biệt khi mua máy mới tại PixelVault.</p>
</div>

<div class="tradein-container">
    <div class="tradein-card">
        <form id="tradein-form">
            <div class="tradein-form-group">
                <label>Loại thiết bị</label>
                <select id="ti-type" required>
                    <option value="">-- Chọn loại thiết bị --</option>
                    <option value="camera">Máy ảnh (Body)</option>
                    <option value="lens">Ống kính (Lens)</option>
                    <option value="accessory">Phụ kiện</option>
                </select>
            </div>
            <div class="tradein-form-group">
                <label>Thương hiệu</label>
                <select id="ti-brand" required>
                    <option value="">-- Chọn thương hiệu --</option>
                    <option value="sony">Sony</option>
                    <option value="canon">Canon</option>
                    <option value="nikon">Nikon</option>
                    <option value="fujifilm">Fujifilm</option>
                    <option value="other">Khác</option>
                </select>
            </div>
            <div class="tradein-form-group">
                <label>Tên thiết bị (Model)</label>
                <input type="text" id="ti-model" placeholder="VD: Sony Alpha a7 IV" required>
            </div>
            <div class="tradein-form-group">
                <label>Giá mua mới hiện tại trên thị trường (VNĐ)</label>
                <input type="number" id="ti-price" placeholder="VD: 55000000" required>
            </div>
            <div class="tradein-form-group">
                <label>Tình trạng hiện tại</label>
                <select id="ti-condition" required>
                    <option value="">-- Chọn tình trạng --</option>
                    <option value="0.8">99% - Đẹp như mới, hoạt động hoàn hảo, fullbox</option>
                    <option value="0.7">95% - Xước dăm nhẹ, kính đẹp, hoạt động tốt</option>
                    <option value="0.55">90% - Ngoại hình cũ, mốc/rễ tre nhẹ nhưng có thể vệ sinh</option>
                    <option value="0.4">80% - Xấu, có lỗi nhỏ, thiếu phụ kiện</option>
                </select>
            </div>
            <button type="button" class="btn btn-primary" style="width:100%; padding:16px; font-size:1.1rem;" onclick="calculateTradeIn()">Định giá ngay</button>
        </form>

        <div class="tradein-result" id="tradein-result">
            <h3>Giá thu mua dự kiến</h3>
            <div class="price" id="ti-result-price">0đ</div>
            <p style="color:var(--text-300); font-size:0.9rem; margin-bottom:20px;">* Giá trị mang tính tham khảo. Giá thu chính thức sẽ được báo sau khi kiểm tra thực tế.</p>
            
            <div class="voucher-box" id="ti-voucher-box" style="display:none;">
                <div style="color:var(--text-200); font-size:0.95rem;">Chúc mừng! Bạn nhận được Voucher trợ giá <b style="color:var(--gold-400);">5%</b> (tối đa 2.000.000đ) khi lên đời:</div>
                <div class="voucher-code" id="ti-voucher-code"></div>
                <div style="font-size:0.85rem; color:var(--text-400);">Lưu mã này và nhập ở bước Thanh toán nhé!</div>
            </div>

            <button type="button" class="btn btn-outline" style="margin-top:24px; width:100%;" onclick="resetTradeIn()">Định giá máy khác</button>
        </div>
    </div>
</div>

<script>
function calculateTradeIn() {
    const type = document.getElementById('ti-type').value;
    const brand = document.getElementById('ti-brand').value;
    const model = document.getElementById('ti-model').value;
    const priceStr = document.getElementById('ti-price').value;
    const condition = document.getElementById('ti-condition').value;

    if (!type || !brand || !model || !priceStr || !condition) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    const price = parseInt(priceStr);
    if (price < 1000000) {
        alert('Giá trị máy quá thấp hoặc không hợp lệ.');
        return;
    }

    const rate = parseFloat(condition);
    let estimate = price * rate;

    // Phụ phí theo loại
    if (type === 'accessory') estimate *= 0.9;
    
    // Làm tròn 100k
    estimate = Math.round(estimate / 100000) * 100000;

    document.getElementById('ti-result-price').innerText = estimate.toLocaleString('vi-VN') + 'đ';
    document.getElementById('tradein-result').style.display = 'block';
    document.getElementById('tradein-form').style.display = 'none';

    // Sinh mã voucher ngẫu nhiên
    const code = 'TRADEIN-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    document.getElementById('ti-voucher-code').innerText = code;
    document.getElementById('ti-voucher-box').style.display = 'block';

    // Cuộn xuống kết quả
    document.getElementById('tradein-result').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetTradeIn() {
    document.getElementById('tradein-form').reset();
    document.getElementById('tradein-result').style.display = 'none';
    document.getElementById('tradein-form').style.display = 'block';
}
</script>
"""

full_html = header + tradein_content + footer
with open('g:/KDDT/website/pages/trade-in.html', 'w', encoding='utf-8') as f:
    f.write(full_html)
