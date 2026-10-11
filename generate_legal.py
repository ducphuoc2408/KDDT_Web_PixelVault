with open('g:/KDDT/website/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

header_end = c.find('<div class="hero-bg-grid"></div>')
if header_end == -1: header_end = c.find('</nav>') + 6

footer_start = c.find('<!-- ============ FOOTER ============ -->')

header = c[:header_end]
header = header.replace('href="assets/', 'href="../assets/').replace('src="assets/', 'src="../assets/')
header = header.replace('href="pages/', 'href="').replace('href="index.html"', 'href="../index.html"')

footer = c[footer_start:]
footer = footer.replace('href="assets/', 'href="../assets/').replace('src="assets/', 'src="../assets/')
footer = footer.replace('href="pages/', 'href="').replace('href="index.html"', 'href="../index.html"')

terms_content = """
<style>
.legal-hero {
    padding: 120px 20px 60px;
    text-align: center;
    background: radial-gradient(circle at center, rgba(212,168,67,0.1) 0%, transparent 70%);
}
.legal-title {
    font-family: 'Outfit', sans-serif;
    font-size: 3rem;
    font-weight: 800;
    color: var(--gold-400);
    margin-bottom: 20px;
}
.legal-subtitle {
    font-size: 1.1rem;
    color: var(--text-300);
}
.legal-container {
    max-width: 800px;
    margin: 0 auto 100px;
    padding: 0 20px;
}
.legal-content {
    background: var(--bg-card);
    border: 1px solid var(--border-1);
    border-radius: var(--r-xl);
    padding: 40px;
    box-shadow: var(--shadow-lg);
    line-height: 1.8;
    color: var(--text-200);
}
.legal-content h2 {
    color: var(--text-100);
    font-family: 'Outfit', sans-serif;
    font-size: 1.5rem;
    margin: 32px 0 16px;
    border-bottom: 1px solid var(--border-2);
    padding-bottom: 8px;
}
.legal-content p {
    margin-bottom: 16px;
}
.legal-content ul {
    margin-bottom: 24px;
    padding-left: 20px;
}
.legal-content li {
    margin-bottom: 8px;
}
</style>

<div class="legal-hero">
    <h1 class="legal-title">Điều Khoản Dịch Vụ</h1>
    <p class="legal-subtitle">Cập nhật lần cuối: 10/10/2026</p>
</div>

<div class="legal-container">
    <div class="legal-content">
        <p>Chào mừng quý khách đến với PixelVault. Khi sử dụng các dịch vụ mua bán và thuê thiết bị tại website của chúng tôi, quý khách vui lòng đọc kỹ và đồng ý với các điều khoản dưới đây.</p>
        
        <h2>1. Chấp thuận điều khoản</h2>
        <p>Bằng việc truy cập, đăng ký tài khoản hoặc thực hiện giao dịch mua bán/thuê mướn tại PixelVault, quý khách xác nhận đã hiểu và đồng ý tuân thủ toàn bộ các quy định trong tài liệu này.</p>
        
        <h2>2. Dịch vụ Mua bán</h2>
        <ul>
            <li><strong>Sản phẩm chính hãng:</strong> Tất cả máy ảnh, ống kính và phụ kiện (mới 100%) đều được bảo hành chính hãng theo quy định của nhà sản xuất (Sony, Canon, Nikon, Fujifilm...).</li>
            <li><strong>Thanh toán:</strong> Chấp nhận thanh toán qua chuyển khoản ngân hàng (quét mã VietQR) hoặc COD. Giao dịch trực tuyến được mã hóa và xác nhận tự động.</li>
            <li><strong>Đổi trả:</strong> Hỗ trợ 1 đổi 1 trong vòng 7 ngày nếu có lỗi phần cứng từ nhà sản xuất.</li>
        </ul>
        
        <h2>3. Dịch vụ Cho Thuê Thiết Bị</h2>
        <ul>
            <li><strong>Tiền cọc:</strong> Khách hàng cần đặt cọc 50% giá trị thiết bị và để lại giấy tờ tùy thân (CCCD gắn chip / Hộ chiếu) gốc.</li>
            <li><strong>Phí thuê:</strong> Phí thuê được tính cố định là 5%/ngày trên tổng giá trị thiết bị. Tiền thuê sẽ được trừ vào tiền cọc khi trả máy.</li>
            <li><strong>Trách nhiệm bảo quản:</strong> Khách hàng chịu trách nhiệm 100% đối với các hỏng hóc, rơi vỡ, vô nước phát sinh trong quá trình thuê. Mức đền bù sẽ được tính theo barem linh kiện của hãng.</li>
        </ul>

        <h2>4. Dịch vụ Thu Cũ Đổi Mới</h2>
        <p>Hệ thống định giá tự động trên website chỉ mang tính chất tham khảo. Mức giá thu mua chính thức chỉ được chốt sau khi kỹ thuật viên của PixelVault kiểm tra trực tiếp tình trạng ngoại hình, cảm biến và hoạt động của máy.</p>

        <h2>5. Giải quyết tranh chấp</h2>
        <p>Mọi thắc mắc, khiếu nại phát sinh từ giao dịch sẽ được ưu tiên giải quyết thông qua thương lượng hòa giải. Trong trường hợp không đạt được thỏa thuận, vụ việc sẽ được đưa ra cơ quan có thẩm quyền tại Việt Nam.</p>
    </div>
</div>
"""

privacy_content = """
<style>
.legal-hero {
    padding: 120px 20px 60px;
    text-align: center;
    background: radial-gradient(circle at center, rgba(212,168,67,0.1) 0%, transparent 70%);
}
.legal-title {
    font-family: 'Outfit', sans-serif;
    font-size: 3rem;
    font-weight: 800;
    color: var(--gold-400);
    margin-bottom: 20px;
}
.legal-subtitle {
    font-size: 1.1rem;
    color: var(--text-300);
}
.legal-container {
    max-width: 800px;
    margin: 0 auto 100px;
    padding: 0 20px;
}
.legal-content {
    background: var(--bg-card);
    border: 1px solid var(--border-1);
    border-radius: var(--r-xl);
    padding: 40px;
    box-shadow: var(--shadow-lg);
    line-height: 1.8;
    color: var(--text-200);
}
.legal-content h2 {
    color: var(--text-100);
    font-family: 'Outfit', sans-serif;
    font-size: 1.5rem;
    margin: 32px 0 16px;
    border-bottom: 1px solid var(--border-2);
    padding-bottom: 8px;
}
.legal-content p {
    margin-bottom: 16px;
}
.legal-content ul {
    margin-bottom: 24px;
    padding-left: 20px;
}
.legal-content li {
    margin-bottom: 8px;
}
</style>

<div class="legal-hero">
    <h1 class="legal-title">Chính Sách Bảo Mật</h1>
    <p class="legal-subtitle">Bảo vệ dữ liệu khách hàng là ưu tiên số 1 của PixelVault</p>
</div>

<div class="legal-container">
    <div class="legal-content">
        <p>PixelVault cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.</p>
        
        <h2>1. Thu thập thông tin cá nhân</h2>
        <p>Chúng tôi chỉ thu thập thông tin khi bạn tự nguyện cung cấp trong quá trình tạo tài khoản, đặt hàng hoặc làm thủ tục thuê máy. Thông tin bao gồm: Họ tên, Số điện thoại, Địa chỉ email, Địa chỉ giao hàng và Ảnh chụp giấy tờ tùy thân (chỉ đối với dịch vụ thuê).</p>
        
        <h2>2. Mục đích sử dụng thông tin</h2>
        <ul>
            <li>Xử lý các đơn đặt hàng và giao hàng.</li>
            <li>Xác minh danh tính nhằm phòng chống rủi ro trong dịch vụ cho thuê thiết bị giá trị cao.</li>
            <li>Cung cấp hỗ trợ, bảo hành và gửi thông báo liên quan đến trạng thái giao dịch (thông qua hệ thống Email tự động).</li>
            <li>Nâng cấp trải nghiệm cá nhân hóa bằng hệ thống Trợ lý AI (Bot sẽ không lưu trữ dữ liệu riêng tư của bạn vào mô hình ngôn ngữ lớn).</li>
        </ul>
        
        <h2>3. Lưu trữ và Bảo vệ dữ liệu</h2>
        <p>Toàn bộ cơ sở dữ liệu của người dùng được lưu trữ trên hạ tầng điện toán đám mây Supabase an toàn. Chúng tôi áp dụng RLS (Row Level Security) để đảm bảo không ai khác ngoài chính bạn có quyền truy cập vào danh sách đơn hàng và lịch sử thuê của bạn.</p>

        <h2>4. Không chia sẻ dữ liệu cho bên thứ 3</h2>
        <p>PixelVault cam kết không mua bán, trao đổi hoặc cung cấp thông tin cá nhân của bạn cho bất kỳ bên thứ 3 nào, ngoại trừ các đơn vị vận chuyển (để giao hàng) và cơ quan chức năng (khi có yêu cầu hợp pháp).</p>

        <h2>5. Dữ liệu thanh toán</h2>
        <p>Chúng tôi không lưu trữ thông tin thẻ tín dụng hay thẻ ngân hàng của bạn. Toàn bộ quá trình quét mã QR và xác thực thanh toán được thực hiện thông qua hệ thống tự động API của ngân hàng (VietQR & SePay webhook).</p>
    </div>
</div>
"""

with open('g:/KDDT/website/pages/terms.html', 'w', encoding='utf-8') as f:
    f.write(header + terms_content + footer)

with open('g:/KDDT/website/pages/privacy.html', 'w', encoding='utf-8') as f:
    f.write(header + privacy_content + footer)

print('Created legal pages')
