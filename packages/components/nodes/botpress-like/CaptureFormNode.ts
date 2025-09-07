import { INode } from '../../src/Interface'

/**
 * Renders a mini-form in chat (sequentially).
 * Fields is CSV: "Name:userName, Phone:userPhone, Joining From:joiningDate"
 */
class CaptureFormNode implements INode {
  label = 'Capture Form'
  name = 'captureFormNode'
  type = 'CaptureFormNode'
  category = 'Chat'
  version = 1.0

  inputs = [
    { label: 'Fields (Label:var CSV)', name: 'fields', type: 'string',
      placeholder: 'Name:userName, Phone:userPhone, Joining From:joiningDate' }
  ]
  outputs = [{ label: 'Done', name: 'done', baseClasses: ['json'] }]

  async run(nodeData: any) {
    const fieldsCsv: string = nodeData.inputs?.fields || ''
    const pairs = fieldsCsv.split(',').map(s => s.trim()).filter(Boolean)
    const fields = pairs.map(p => {
      const [label, variable] = p.split(':').map(x => x.trim())
      return { label, variable }
    })

    // State machine: ask next unanswered field
    nodeData.flowData = nodeData.flowData || {}
    for (const f of fields) {
      if (!nodeData.flowData[f.variable]) {
        if (nodeData.websocketInput?.text) {
          nodeData.flowData[f.variable] = nodeData.websocketInput.text
        } else {
          // Ask this question
          return { ui: { type: 'text', text: `👉 ${f.label}:` } }
        }
      }
    }

    // All answered
    return { ...nodeData.flowData }
  }
}

module.exports = { nodeClass: CaptureFormNode }
