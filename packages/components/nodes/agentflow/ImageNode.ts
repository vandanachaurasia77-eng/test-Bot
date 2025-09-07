import { INode, INodeData, INodeParams } from '../../src/Interface'

class ImageNode implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    version: number

    inputs: INodeParams[]
    outputs: INodeParams[]

    constructor() {
        this.label = 'Image Node'
        this.name = 'imageNode'
        this.type = 'ChatFlow'
        this.icon = 'fa-image'
        this.category = 'ChatFlow'
        this.description = 'Sends an image with an optional caption'
        this.baseClasses = ['ImageNode']
        this.version = 1

        this.inputs = [
            {
                label: 'Image URL',
                name: 'imageUrl',
                type: 'string',
                placeholder: 'https://example.com/room.jpg'
            },
            {
                label: 'Caption (Optional)',
                name: 'caption',
                type: 'string',
                default: ''
            }
        ]

        this.outputs = [
            {
                label: 'Image Output',
                name: 'imageOutput',
                type: 'string'
            }
        ]
    }

    async run(nodeData: INodeData): Promise<any> {
        const imageUrl = nodeData.inputs?.imageUrl as string
        const caption = nodeData.inputs?.caption as string

        if (!imageUrl) {
            return '⚠️ No image provided.'
        }

        return `🖼️ Image: ${imageUrl}\n${caption ? `💬 ${caption}` : ''}`
    }
}

module.exports = { nodeClass: ImageNode }
