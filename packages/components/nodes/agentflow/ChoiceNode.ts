import { INode, INodeParams, INodeOutputs } from '../../src/Interface'

/**
 * ChoiceNode
 * Shows a message + renders quick reply buttons in the UI.
 * Stores the selected value into workflow variable (e.g., menuChoice).
 */
class ChoiceNode implements INode {
  label = 'Choice (Quick Replies)'
  name = 'choiceNode'
  type = 'ChoiceNode'
  category = 'Chat'
  version = 1.0

  inputs: INodeParams[] = [
    { label: 'Prompt', name: 'prompt', type: 'string', placeholder: 'Choose an option:' },
    { label: 'Choices (comma separated)', name: 'choices', type: 'string', placeholder: 'Rooms, Location, Book' },
    { label: 'Store As (variable)', name: 'storeVar', type: 'string', placeholder: 'menuChoice' }
  ]

  outputs: INodeOutputs[] = [
    { label: 'On Select', name: 'onSelect', baseClasses: ['string'] }
  ]

  async run(nodeData: any) {
    const prompt: string = nodeData.inputs?.prompt || 'Choose:'
    const choicesCsv: string = nodeData.inputs?.choices || ''
    const storeVar: string = nodeData.inputs?.storeVar || 'menuChoice'
    const choices = choicesCsv.split(',').map(s => s.trim()).filter(Boolean)

    // Emit a UI directive the UI can understand
    const message = {
      type: 'quick_replies',       // UI will render buttons for this
      text: prompt,
      choices                      // e.g., ["Rooms","Location","Book"]
    }

    // Flowise expects to return what goes to the next edge.
    // We'll wait for user selection via frontend; value will come back
    // as nodeData.websocketInput?.text (Flowise pattern for chat UIs).
    if (nodeData.websocketInput?.text) {
      // Save to flow state:
      nodeData.flowData = nodeData.flowData || {}
      nodeData.flowData[storeVar] = nodeData.websocketInput.text
      return nodeData.websocketInput.text
    }

    // First render pass: send UI payload so frontend shows buttons
    return { ui: message }
  }
}

module.exports = { nodeClass: ChoiceNode }
