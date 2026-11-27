import api, { emitDbUpdate } from './api'

export const defaultPaymentGatewaySettings = {
  enabled: true,
  mode: 'test',
  provider: 'custom_gateway',
  gatewayUrl: 'https://api.razorpay.com/v1/checkout',
  liveUrl: '',
  testUrl: 'https://sandbox.payment-gateway.io/v1/checkout',
  keyId: 'rzp_test_smar_gateway',
  keySecret: 'sec_test_smar_99887766',
  webhookSecret: 'whsec_smar_ecomm_2026',
  callbackUrl: 'https://smarfoods.in/api/payment/callback',
  upiId: 'smar@okhdfcbank',
  merchantName: 'SMAR (GREEN WAY ENTERPRISES)',
  qrType: 'dynamic',
  customQrUrl: '',
  allowUPI: true,
  allowCards: true,
  allowNetBanking: true,
  allowCOD: true,
  autoApproveInTest: true,
  instructions: 'Scan the QR code with any UPI app (Google Pay, PhonePe, Paytm, BHIM) to pay instantly.',
}

export async function getPaymentGatewaySettings() {
  const { data } = await api.get('/settings/payment-gateway')
  return { ...defaultPaymentGatewaySettings, ...(data || {}) }
}

export async function updatePaymentGatewaySettings(updates) {
  const { data } = await api.put('/settings/payment-gateway', updates)
  emitDbUpdate('payment_gateway_settings', data)
  return data
}

export async function testGatewayConnection(settings) {
  const { data } = await api.post('/settings/payment-gateway/test', settings)
  return data
}
