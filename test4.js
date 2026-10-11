ontent:center;margin:0 auto 20px;">
                  <svg style="width:40px;height:40px;stroke:var(--gold-400);fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 style="font-family:'Outfit',sans-serif; font-size:2rem; font-weight:700; color:var(--gold-400); margin-bottom:12px;">Đã Nhận Được Tiền!</h2>
                <p style="font-size:1.05rem; color:var(--text-300); margin-bottom:32px; max-width:400px; margin-left:auto; margin-right:auto; line-height:1.6;">
                  Hệ thống đã tự động xác nhận thanh toán thành công cho đơn hàng <b>${orderId}</b>.<br>Cảm ơn bạn đã tin tưởng PixelVault!
                </p>
                <a href="../index.html" class="btn btn-primary">Tiếp tục mua sắm</a>
              </div>
            `;
            sendConfirmationEmail();
            window._pvSupabase.removeChannel(channel);
          }
        }
      )
      .subscribe();
  }

  // update cart badge
  document.querySelectorAll('.cart-badge').forEach(b => b.style.display = 'none');
}
</script>
<style>
  @keyframes popIn {
    0% { transform: scale(0.9); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
</style>
</body>
</html>













