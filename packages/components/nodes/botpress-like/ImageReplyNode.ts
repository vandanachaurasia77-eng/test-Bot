import { INode } from '../../src/Interface'

class ImageReplyNode implements INode {
  label = 'Image Reply'
  name = 'imageReplyNode'
  type = 'ImageReplyNode'
  category = 'Chat'
  version = 1.0
  inputs = [
    { label: 'Image URL', name: 'imageUrl', type: 'string' },
    { label: 'Caption', name: 'caption', type: 'string', optional: true }
  ]
  outputs = []

  async run(nodeData: any) {
    const imageUrl = nodeData.inputs?.imageUrl
    const caption = nodeData.inputs?.caption || ''
    return { ui: { type: 'image', imageUrl, caption } }
  }
}

module.exports = { nodeClass: ImageReplyNode }
