import { INode } from '../../src/Interface'
import nodemailer from 'nodemailer'

class EmailNode implements INode {
  label = 'Email (SMTP)'
  name = 'emailNode'
  type = 'EmailNode'
  category = 'Actions'
  version = 1.0

  inputs = [
    { label: 'SMTP Host', name: 'smtpHost', type: 'string' },
    { label: 'SMTP Port', name: 'smtpPort', type: 'number' },
    { label: 'SMTP User', name: 'smtpUser', type: 'string' },
    { label: 'SMTP Pass', name: 'smtpPass', type: 'password' },
    { label: 'From', name: 'from', type: 'string' },
    { label: 'To', name: 'to', type: 'string' },
    { label: 'Subject', name: 'subject', type: 'string' },
    { label: 'Body (supports {{vars}})', name: 'body', type: 'string', rows: 6 }
  ]
  outputs = [{ label: 'Result', name: 'result', baseClasses: ['string'] }]

  async run(nodeData: any) {
    const get = (k: string) => nodeData.inputs?.[k]
    // simple mustache-ish replacement from flowData
    const render = (s: string) =>
      s?.replace(/\{\{(\w+)\}\}/g, (_: any, v: string) => nodeData.flowData?.[v] ?? '')

    const transporter = nodemailer.createTransport({
      host: get('smtpHost'),
      port: Number(get('smtpPort')),
      secure: false,
      auth: { user: get('smtpUser'), pass: get('smtpPass') }
    })

    const info = await transporter.sendMail({
      from: get('from'),
      to: get('to'),
      subject: render(get('subject')),
      text: render(get('body'))
    })

    return `Email sent: ${info.messageId}`
  }
}

module.exports = { nodeClass: EmailNode }
